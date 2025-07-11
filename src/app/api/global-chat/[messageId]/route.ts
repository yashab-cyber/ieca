import { NextRequest, NextResponse } from 'next/server';
import { globalChatService } from '@/lib/services';
import { z } from 'zod';

const updateSchema = z.object({
  userId: z.string(),
  content: z.string().min(1),
});

const deleteSchema = z.object({
  userId: z.string(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const body = await request.json();
    const { userId, content } = updateSchema.parse(body);
    const messageId = params.messageId;

    // Get the message to verify ownership
    const message = await globalChatService.getMessage(messageId);
    
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    if (message.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: You can only edit your own messages' },
        { status: 403 }
      );
    }

    // Only allow editing text and code messages
    if (message.messageType !== 'TEXT' && message.messageType !== 'CODE') {
      return NextResponse.json(
        { success: false, message: 'Only text and code messages can be edited' },
        { status: 400 }
      );
    }

    // Update the message
    const updatedMessage = await globalChatService.updateMessage(messageId, {
      content,
      isEdited: true,
    });

    return NextResponse.json({
      success: true,
      data: updatedMessage,
    });

  } catch (error) {
    console.error('Message update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const body = await request.json();
    const { userId } = deleteSchema.parse(body);
    const messageId = params.messageId;

    // Get the message to verify ownership
    const message = await globalChatService.getMessage(messageId);
    
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    if (message.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: You can only delete your own messages' },
        { status: 403 }
      );
    }

    // Delete the message and its attachments
    await globalChatService.deleteMessage(messageId);

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    });

  } catch (error) {
    console.error('Message deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
