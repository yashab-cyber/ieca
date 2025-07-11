import { NextRequest, NextResponse } from 'next/server';
import { blogService } from '@/lib/services';
import { z } from 'zod';

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  authorId: z.string().min(1, "Author ID is required"),
});

export async function GET(request: NextRequest) {
  try {
    const posts = await blogService.getAllPosts();
    
    return NextResponse.json({
      success: true,
      data: posts,
    });

  } catch (error) {
    console.error('Blog posts fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);

    const post = await blogService.createPost(validatedData);

    return NextResponse.json({
      success: true,
      message: "Blog post created successfully!",
      data: post,
    });

  } catch (error) {
    console.error('Blog post creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
