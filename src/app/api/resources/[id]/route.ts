import { NextRequest, NextResponse } from 'next/server';
import { resourceService } from '@/lib/services';
import { z } from 'zod';

const updateResourceSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  authorName: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const resource = await resourceService.getResourceById(id);

    if (!resource) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resource,
    });

  } catch (error) {
    console.error('Resource fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch resource' },
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
    const validatedData = updateResourceSchema.parse(body);

    const updatedResource = await resourceService.updateResource(id, validatedData);

    return NextResponse.json({
      success: true,
      message: "Resource updated successfully!",
      data: updatedResource,
    });

  } catch (error) {
    console.error('Resource update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update resource' },
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
    await resourceService.deleteResource(id);

    return NextResponse.json({
      success: true,
      message: "Resource deleted successfully!",
    });

  } catch (error) {
    console.error('Resource deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
