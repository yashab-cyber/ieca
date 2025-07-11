'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Paperclip, 
  Download, 
  Users, 
  Smile,
  Reply,
  Code,
  FileText,
  Image as ImageIcon,
  Archive,
  Edit,
  Trash2,
  Copy,
  Check,
  MoreVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  name: string;
  email: string;
  profile?: {
    avatar?: string;
  };
}

interface Attachment {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  downloadUrl: string;
}

interface Reaction {
  id: string;
  emoji: string;
  user: {
    name: string;
  };
}

interface Message {
  id: string;
  content?: string;
  messageType: 'TEXT' | 'FILE' | 'IMAGE' | 'CODE' | 'DOCUMENT';
  createdAt: string;
  isEdited: boolean;
  user: User;
  replyTo?: {
    id: string;
    content: string;
    user: { name: string; };
  };
  attachments: Attachment[];
  reactions: Reaction[];
  _count: {
    reactions: number;
    replies: number;
  };
}

interface GlobalChatProps {
  currentUserId: string;
}

export function GlobalChat({ currentUserId }: GlobalChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineMembers, setOnlineMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const commonEmojis = ['👍', '❤️', '😂', '😢', '😮', '😡', '🔥', '🎉'];

  useEffect(() => {
    fetchMessages();
    
    // Set up periodic updates
    const interval = setInterval(() => {
      fetchMessages();
      updateLastSeen();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Only scroll to bottom after a short delay to ensure content is rendered
    // Force scroll on initial load, otherwise respect user's scroll position
    const timeoutId = setTimeout(() => {
      scrollToBottom(messages.length <= 1); // Force scroll only if it's the first message load
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const scrollToBottom = (force = false) => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        // Only auto-scroll if user is near the bottom (within 50px) or if forced
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        
        if (force || isNearBottom) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/global-chat');
      const result = await response.json();
      
      if (result.success) {
        setMessages(result.data.messages);
        setOnlineMembers(result.data.onlineMembers);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const updateLastSeen = async () => {
    try {
      await fetch('/api/global-chat', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
    } catch (error) {
      console.error('Error updating last seen:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/global-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          content: newMessage,
          messageType: 'TEXT',
          replyToId: replyTo?.id,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setNewMessage('');
        setReplyTo(null);
        fetchMessages();
        // Force scroll to bottom after sending a message
        setTimeout(() => scrollToBottom(true), 150);
        toast({
          title: 'Message sent',
          description: 'Your message has been sent successfully.',
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if user ID is available
    if (!currentUserId) {
      toast({
        title: 'Error',
        description: 'User not authenticated. Please refresh the page.',
        variant: 'destructive',
      });
      return;
    }

    // Determine message type based on file type
    let messageType: 'FILE' | 'IMAGE' | 'CODE' | 'DOCUMENT' = 'FILE';
    
    if (file.type.startsWith('image/')) {
      messageType = 'IMAGE';
    } else if (file.type.includes('text/') || file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.py') || file.name.endsWith('.java')) {
      messageType = 'CODE';
    } else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('presentation') || file.type.includes('sheet')) {
      messageType = 'DOCUMENT';
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', currentUserId);
      formData.append('messageType', messageType);

      console.log('Uploading file:', { fileName: file.name, size: file.size, type: file.type, messageType });

      const response = await fetch('/api/global-chat/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload response error:', { status: response.status, statusText: response.statusText, errorText });
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        fetchMessages();
        // Force scroll to bottom after file upload
        setTimeout(() => scrollToBottom(true), 150);
        toast({
          title: 'File uploaded',
          description: `${file.name} has been shared successfully.`,
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await fetch(`/api/global-chat/${messageId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          emoji,
          action: 'add',
        }),
      });
      
      fetchMessages();
      setShowEmojiPicker(null);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/global-chat/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          content: newContent,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchMessages();
        setEditingMessage(null);
        setEditContent('');
        toast({
          title: 'Message updated',
          description: 'Your message has been updated successfully.',
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error editing message:', error);
      toast({
        title: 'Error',
        description: 'Failed to update message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/global-chat/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchMessages();
        toast({
          title: 'Message deleted',
          description: 'Your message has been deleted successfully.',
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      toast({
        title: 'Copied!',
        description: 'Message content copied to clipboard.',
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: 'Copy failed',
        description: 'Failed to copy message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const startEdit = (message: Message) => {
    setEditingMessage(message.id);
    setEditContent(message.content || '');
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'CODE': return <Code className="h-4 w-4" />;
      case 'DOCUMENT': return <FileText className="h-4 w-4" />;
      case 'IMAGE': return <ImageIcon className="h-4 w-4" />;
      default: return <Archive className="h-4 w-4" />;
    }
  };

  const renderMessage = (message: Message) => (
    <div key={message.id} className="flex gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-muted/30 transition-colors">
      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
        <AvatarImage src={message.user.profile?.avatar} />
        <AvatarFallback className="text-xs">
          {message.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
          <span className="font-medium text-xs sm:text-sm truncate">{message.user.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
            {message.messageType !== 'TEXT' && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                {getMessageTypeIcon(message.messageType)}
                <span className="hidden sm:inline">{message.messageType}</span>
              </Badge>
            )}
          </div>
        </div>

        {message.replyTo && (
          <div className="bg-muted/50 p-2 rounded mb-2 text-xs sm:text-sm border-l-2 border-primary">
            <span className="font-medium">{message.replyTo.user.name}:</span>
            <span className="ml-1 sm:ml-2 text-muted-foreground break-words">{message.replyTo.content}</span>
          </div>
        )}

        {message.content && (
          <div className="text-xs sm:text-sm mb-2">
            {editingMessage === message.id ? (
              <div className="space-y-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-xs sm:text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleEditMessage(message.id, editContent);
                    }
                    if (e.key === 'Escape') {
                      cancelEdit();
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditMessage(message.id, editContent)}
                    disabled={!editContent.trim()}
                    className="h-6 px-2 text-xs"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancelEdit}
                    className="h-6 px-2 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <p className="break-words whitespace-pre-wrap overflow-wrap-anywhere">{message.content}</p>
                {(message.messageType === 'TEXT' || message.messageType === 'CODE') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyMessage(message.content!, message.id)}
                    className="absolute top-0 right-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {message.attachments.map((attachment) => (
          <div key={attachment.id} className="bg-muted/50 p-2 sm:p-3 rounded-lg mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {getMessageTypeIcon(message.messageType)}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-xs sm:text-sm truncate">{attachment.originalName}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(attachment.fileSize)}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(attachment.downloadUrl, '_blank')}
              className="w-full sm:w-auto flex-shrink-0"
            >
              <Download className="h-4 w-4 mr-1 sm:mr-0" />
              <span className="sm:hidden">Download</span>
            </Button>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setReplyTo(message)}
            className="h-6 sm:h-8 px-2 text-xs"
          >
            <Reply className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Reply</span>
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
            className="h-6 sm:h-8 px-2 text-xs"
          >
            <Smile className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">React</span>
          </Button>

          {/* Copy button for text and code messages (for all users) */}
          {(message.messageType === 'TEXT' || message.messageType === 'CODE') && message.content && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopyMessage(message.content!, message.id)}
              className="h-6 sm:h-8 px-2 text-xs"
            >
              {copiedMessageId === message.id ? (
                <Check className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 mr-1" />
              )}
              <span className="hidden sm:inline">
                {copiedMessageId === message.id ? 'Copied!' : 'Copy'}
              </span>
            </Button>
          )}

          {/* Edit/Delete dropdown for message owner */}
          {message.user.id === currentUserId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 sm:h-8 px-2 text-xs"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(message.messageType === 'TEXT' || message.messageType === 'CODE') && (
                  <DropdownMenuItem onClick={() => startEdit(message)}>
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => handleDeleteMessage(message.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(
                message.reactions.reduce((acc, reaction) => {
                  acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([emoji, count]) => (
                <Badge key={emoji} variant="secondary" className="text-xs cursor-pointer">
                  {emoji} {count}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {showEmojiPicker === message.id && (
          <div className="flex flex-wrap gap-1 mt-2 p-2 bg-background border rounded-lg">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                size="sm"
                variant="ghost"
                onClick={() => handleReaction(message.id, emoji)}
                className="h-8 w-8 p-0 text-base hover:bg-muted"
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="h-[400px] sm:h-[500px] lg:h-[600px] flex flex-col">
      <CardHeader className="pb-3 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">Global Chat</CardTitle>
          <div className="flex items-center gap-1 sm:gap-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {onlineMembers.length} online
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-2 sm:px-4">
          <div className="space-y-1">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {replyTo && (
          <div className="px-3 sm:px-4 py-2 bg-muted/30 border-t">
            <div className="flex items-start sm:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Replying to <strong>{replyTo.user.name}</strong>
                </span>
                <p className="text-xs text-muted-foreground truncate mt-1 sm:mt-0 sm:inline sm:ml-1">
                  {replyTo.content}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setReplyTo(null)}
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        <div className="p-3 sm:p-4 border-t">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <Paperclip className="h-4 w-4 mr-1 sm:mr-0" />
                <span className="sm:hidden">Attach</span>
              </Button>
              
              <Button 
                size="sm" 
                onClick={sendMessage} 
                disabled={isLoading || !newMessage.trim()}
                className="flex-1 sm:flex-none"
              >
                <Send className="h-4 w-4 mr-1 sm:mr-0" />
                <span className="sm:hidden">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
