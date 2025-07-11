import { NextRequest, NextResponse } from 'next/server';
import { commentService } from '@/lib/services';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, "Content is required"),
  userId: z.string().min(1, "User ID is required"),
  postId: z.string().min(1, "Post ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = commentSchema.parse(body);

    const comment = await commentService.createComment(validatedData);

    return NextResponse.json({
      success: true,
      message: "Comment created successfully!",
      data: comment,
    });

  } catch (error) {
    console.error('Comment creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      );
    }

    const comments = await commentService.getCommentsByPost(postId);

    return NextResponse.json({
      success: true,
      data: comments,
    });

  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
