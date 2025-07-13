import { NextRequest, NextResponse } from 'next/server';
import { BadgeEmailService } from '@/lib/services/badge-email-service';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check and send badge emails
    const result = await BadgeEmailService.checkAndSendBadgeEmails(userId);

    return NextResponse.json({
      success: result,
      message: result ? 'Badge email notifications processed successfully' : 'Failed to process badge email notifications'
    });

  } catch (error) {
    console.error('Badge email notification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process badge email notifications' },
      { status: 500 }
    );
  }
}

// GET endpoint to manually trigger badge email check for current user
export async function GET(request: NextRequest) {
  try {
    // In production, get userId from session/auth
    const userId = 'cmd0ehgay00008ma38q066qki'; // Replace with actual user ID from session

    const result = await BadgeEmailService.checkAndSendBadgeEmails(userId);

    return NextResponse.json({
      success: result,
      message: result ? 'Badge email check completed successfully' : 'Failed to check badge emails'
    });

  } catch (error) {
    console.error('Badge email check error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check badge emails' },
      { status: 500 }
    );
  }
}
