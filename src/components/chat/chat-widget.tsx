'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { chat } from '@/ai/flows/chat-flow';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';

export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  content: string;
}

const suggestedQuestions = [
    "What is IECA?",
    "What services do you offer?",
    "How can I join IECA?",
    "Is IECA a government agency?",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load chat history from localStorage
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      setMessages(JSON.parse(storedHistory));
    } else {
        setMessages([
            { role: 'model', content: "Hello! I'm the IECA AI assistant. How can I help you today?" }
        ]);
    }
  }, []);

  useEffect(() => {
    // Save chat history to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
        inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async (question?: string) => {
    const userMessageContent = question || input;
    if (!userMessageContent.trim() && !question) return;

    const newUserMessage: Message = { role: 'user', content: userMessageContent };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageContent,
          history: messages,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get response');
      }

      const assistantMessage: Message = { role: 'model', content: result.response };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive"
      });
      setMessages(prev => prev.slice(0, -1)); // remove user message on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <MessageSquare className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[calc(100%-2rem)] max-w-md z-50">
      <Card className="flex flex-col h-[60vh] bg-background/80 backdrop-blur-xl border-border shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className='flex items-center gap-3'>
                 <Avatar>
                    <AvatarFallback className='bg-primary text-primary-foreground'><Bot /></AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg font-headline">IECA Assistant</CardTitle>
                </div>
            </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close chat">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
             <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? "justify-end" : "justify-start")}>
                  {message.role === 'model' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/20"><Bot className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("rounded-lg px-3 py-2 max-w-[80%]", message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
               {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                       <AvatarFallback className="bg-primary/20"><Bot className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-3 py-2 bg-muted flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-0"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                )}
                {!isLoading && messages.length === 1 && (
                     <div className="p-4 space-y-2">
                        <p className="text-sm text-muted-foreground text-center mb-4">Or try a suggested question:</p>
                        {suggestedQuestions.map(q => (
                             <Button key={q} variant="outline" size="sm" className="w-full justify-start h-auto py-2" onClick={() => handleSend(q)}>
                                {q}
                            </Button>
                        ))}
                     </div>
                )}
             </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-2 border-t">
          <div className="flex items-center w-full gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask a question..."
              className="flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} aria-label="Send message">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
