import { NextRequest, NextResponse } from 'next/server';
import { BadgeEmailService } from '@/lib/services/badge-email-service';

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, userName, badge, totalBadges, nextBadgeHint } = await request.json();

    // Validate required fields
    if (!userId || !userEmail || !userName || !badge) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Send badge email
    const emailSent = await BadgeEmailService.sendBadgeEarnedEmail({
      userId,
      userEmail,
      userName,
      badge,
      totalBadges,
      nextBadgeHint
    });

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Badge email sent successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send badge email'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Badge email API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    // This would check for new badges and send emails automatically
    // For now, return a test response
    return NextResponse.json({
      success: true,
      message: 'Badge email check completed',
      userId
    });

  } catch (error) {
    console.error('Badge email check error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
