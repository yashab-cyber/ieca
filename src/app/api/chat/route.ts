import { NextRequest, NextResponse } from 'next/server';
import { chatService } from '@/lib/services';
import { chat } from '@/ai/flows/chat-flow';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ).optional(),
  userId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input
    const { message, history = [], userId } = chatSchema.parse(body);
    
    // Create conversation history with the new message
    const fullHistory = [...history, { role: 'user' as const, content: message }];
    
    // Get AI response
    const response = await chat({ history: fullHistory });
    
    // Save both the user message and AI response to database
    await chatService.saveChatMessage({
      userId,
      message,
      response,
      role: 'USER',
      metadata: {
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
      },
    });

    await chatService.saveChatMessage({
      userId,
      message: response,
      role: 'MODEL',
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      response,
      history: [...fullHistory, { role: 'model', content: response }],
    });

  } catch (error) {
    console.error('Chat error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Invalid input",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to process chat message. Please try again.",
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get chat history for user or recent messages for admin
    const messages = await chatService.getChatHistory(userId || undefined, limit);
    
    return NextResponse.json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to fetch chat history",
    }, { status: 500 });
  }
}
