import { NextRequest, NextResponse } from 'next/server';
import { globalChatService } from '@/lib/services';
import { z } from 'zod';

const reactionSchema = z.object({
  userId: z.string(),
  emoji: z.string(),
  action: z.enum(['add', 'remove']),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const body = await request.json();
    const { userId, emoji, action } = reactionSchema.parse(body);
    const messageId = params.messageId;

    let result;
    
    if (action === 'add') {
      result = await globalChatService.addReaction(messageId, userId, emoji);
    } else {
      result = await globalChatService.removeReaction(messageId, userId, emoji);
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Reaction error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update reaction' },
      { status: 500 }
    );
  }
}
