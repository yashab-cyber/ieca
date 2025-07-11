import { NextRequest, NextResponse } from 'next/server';
import { blogService } from '@/lib/services';
import { z } from 'zod';

const updateBlogSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const post = await blogService.getPostById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });

  } catch (error) {
    console.error('Blog post fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateBlogSchema.parse(body);

    const updatedPost = await blogService.updatePost(id, validatedData);

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully!",
      data: updatedPost,
    });

  } catch (error) {
    console.error('Blog post update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update blog post' },
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
    await blogService.deletePost(id);

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully!",
    });

  } catch (error) {
    console.error('Blog post deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
