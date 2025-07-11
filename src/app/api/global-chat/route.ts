import { NextRequest, NextResponse } from 'next/server';
import { globalChatService } from '@/lib/services';
import { z } from 'zod';

const sendMessageSchema = z.object({
  userId: z.string(),
  content: z.string().optional(),
  messageType: z.enum(['TEXT', 'FILE', 'IMAGE', 'CODE', 'DOCUMENT']).optional(),
  replyToId: z.string().optional(),
});

const reactionSchema = z.object({
  userId: z.string(),
  emoji: z.string(),
  action: z.enum(['add', 'remove']),
});

// Get global chat room and messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get or create the global room
    const room = await globalChatService.getGlobalRoom();
    
    if (!room) {
      return NextResponse.json(
        { success: false, message: 'Failed to create global chat room' },
        { status: 500 }
      );
    }

    // Get messages
    const messages = await globalChatService.getMessages(room.id, limit, offset);
    
    // Get online members
    const onlineMembers = await globalChatService.getOnlineMembers(room.id);

    return NextResponse.json({
      success: true,
      data: {
        room,
        messages: messages.reverse(), // Reverse to show oldest first
        onlineMembers,
      },
    });

  } catch (error) {
    console.error('Global chat GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch chat data' },
      { status: 500 }
    );
  }
}

// Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, content, messageType, replyToId } = sendMessageSchema.parse(body);

    // Get or create the global room
    const room = await globalChatService.getGlobalRoom();
    
    if (!room) {
      return NextResponse.json(
        { success: false, message: 'Failed to access global chat room' },
        { status: 500 }
      );
    }

    // Join user to room if not already joined
    await globalChatService.joinRoom(room.id, userId);

    // Send message
    const message = await globalChatService.sendMessage({
      roomId: room.id,
      userId,
      content,
      messageType,
      replyToId,
    });

    return NextResponse.json({
      success: true,
      data: message,
    });

  } catch (error) {
    console.error('Global chat POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// Update last seen (for online status)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get or create the global room
    const room = await globalChatService.getGlobalRoom();
    
    if (!room) {
      return NextResponse.json(
        { success: false, message: 'Failed to access global chat room' },
        { status: 500 }
      );
    }

    // Update last seen
    await globalChatService.updateLastSeen(room.id, userId);

    return NextResponse.json({
      success: true,
      message: 'Last seen updated',
    });

  } catch (error) {
    console.error('Global chat PATCH error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update status' },
      { status: 500 }
    );
  }
}
