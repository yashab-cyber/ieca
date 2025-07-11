import { NextRequest, NextResponse } from 'next/server';
import { applicationService } from '@/lib/services';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']),
  reviewNotes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, reviewNotes } = updateSchema.parse(body);
    const applicationId = params.id;

    const updatedApplication = await applicationService.updateApplicationStatus(
      applicationId,
      status,
      reviewNotes || ''
    );

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });

  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = params.id;
    const application = await applicationService.getApplicationById(applicationId);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });

  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get application' },
      { status: 500 }
    );
  }
}
