import { NextRequest, NextResponse } from 'next/server';
import { commentService } from '@/lib/services';
import { z } from 'zod';

const updateCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content } = updateCommentSchema.parse(body);

    const updatedComment = await commentService.updateComment(id, content);

    return NextResponse.json({
      success: true,
      message: "Comment updated successfully!",
      data: updatedComment,
    });

  } catch (error) {
    console.error('Comment update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await commentService.deleteComment(id);

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully!",
    });

  } catch (error) {
    console.error('Comment deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
