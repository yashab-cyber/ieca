import { NextRequest, NextResponse } from 'next/server';
import { resourceService } from '@/lib/services';
import { z } from 'zod';

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  authorName: z.string().min(1, "Author name is required"),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    let resources;
    
    if (category || difficulty) {
      resources = await resourceService.getResourcesByFilters({
        category,
        difficulty: difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
      });
    } else {
      resources = await resourceService.getAllResources();
    }

    return NextResponse.json({
      success: true,
      data: resources,
    });

  } catch (error) {
    console.error('Resources fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resourceSchema.parse(body);

    const resource = await resourceService.createResource({
      ...validatedData,
      tags: validatedData.tags || [],
    });

    return NextResponse.json({
      success: true,
      message: "Resource created successfully!",
      data: resource,
    });

  } catch (error) {
    console.error('Resource creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
