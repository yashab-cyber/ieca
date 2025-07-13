import { NextRequest, NextResponse } from 'next/server';
import { BadgeEmailService } from '@/lib/services/badge-email-service';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, userName } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if this is user's first login and they should get the welcome badge
    const isFirstTime = await checkFirstLogin(userId);
    
    if (isFirstTime) {
      // Create welcome badge
      const welcomeBadge = {
        id: 'welcome-aboard',
        title: 'Welcome Aboard!',
        description: 'Successfully joined the IECA cybersecurity community',
        icon: 'UserPlus',
        type: 'welcome' as const,
        earnedAt: new Date().toISOString(),
      };

      // Send welcome email
      const emailSent = await BadgeEmailService.sendWelcomeEmail({
        userId: user.id,
        userEmail: userEmail || user.email,
        userName: userName || user.name || 'User',
        badge: welcomeBadge,
        totalBadges: 1
      });

      return NextResponse.json({
        success: true,
        message: 'Welcome badge awarded and email sent!',
        badge: welcomeBadge,
        emailSent,
        isFirstLogin: true
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'User already has welcome badge',
        isFirstLogin: false
      });
    }

  } catch (error) {
    console.error('First login badge error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process first login badge' },
      { status: 500 }
    );
  }
}

// Helper function to check if this is truly a first login
async function checkFirstLogin(userId: string): Promise<boolean> {
  try {
    // Check if user has any previous activity or welcome email
    const [
      hasSecurityUsage,
      hasScans,
      hasReports,
      hasPosts,
      hasMessages,
      hasWelcomeEmail
    ] = await Promise.all([
      prisma.securityToolUsage.count({ where: { userId } }),
      prisma.securityScan.count({ where: { userId } }),
      prisma.vulnerabilityReport.count({ where: { userId } }),
      prisma.blogPost.count({ where: { authorId: userId } }),
      prisma.chatMessage.count({ where: { userId } }),
      prisma.emailLog.count({ 
        where: { 
          recipient: { contains: userId },
          subject: { contains: 'Welcome to IECA' },
          status: 'SENT'
        } 
      })
    ]);

    // If user has no activity and hasn't received a welcome email, it's their first time
    const hasAnyActivity = hasSecurityUsage > 0 || hasScans > 0 || hasReports > 0 || hasPosts > 0 || hasMessages > 0;
    const hasReceivedWelcome = hasWelcomeEmail > 0;

    return !hasAnyActivity && !hasReceivedWelcome;
  } catch (error) {
    console.error('Error checking first login:', error);
    return false;
  }
}

// GET endpoint for testing first login badge
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'cmd0ehgay00008ma38q066qki';
    const email = searchParams.get('email') || 'yashabalam707@gmail.com';
    const name = searchParams.get('name') || 'Yashab Alam';

    // Trigger first login check
    const welcomeBadge = {
      id: 'welcome-aboard',
      title: 'Welcome Aboard!',
      description: 'Successfully joined the IECA cybersecurity community',
      icon: 'UserPlus',
      type: 'welcome' as const,
      earnedAt: new Date().toISOString(),
    };

    // Send test welcome email
    const emailSent = await BadgeEmailService.sendWelcomeEmail({
      userId: userId,
      userEmail: email,
      userName: name,
      badge: welcomeBadge,
      totalBadges: 1
    });

    return NextResponse.json({
      success: true,
      message: `Test welcome email sent to ${email}`,
      badge: welcomeBadge,
      emailSent
    });

  } catch (error) {
    console.error('Test first login error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send test welcome email' },
      { status: 500 }
    );
  }
}
