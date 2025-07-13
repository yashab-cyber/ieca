import { NextRequest, NextResponse } from 'next/server';
import { BadgeEmailService } from '@/lib/services/badge-email-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const badgeType = searchParams.get('type') || 'security';
    
    // Test badge data for different types
    const testBadges = {
      security: {
        id: 'security-expert',
        title: 'Security Expert',
        description: 'Used 50+ security tools',
        icon: 'ShieldCheck',
        type: 'security' as const,
        earnedAt: new Date().toISOString(),
      },
      scanner: {
        id: 'master-scanner',
        title: 'Master Scanner',
        description: 'Completed 25+ security scans',
        icon: 'Zap',
        type: 'scanner' as const,
        earnedAt: new Date().toISOString(),
      },
      researcher: {
        id: 'bug-hunter',
        title: 'Bug Hunter',
        description: 'Submitted 5+ vulnerability reports',
        icon: 'Award',
        type: 'researcher' as const,
        earnedAt: new Date().toISOString(),
      },
      content: {
        id: 'blogger',
        title: 'Blogger',
        description: 'Published 3+ blog posts',
        icon: 'Target',
        type: 'content' as const,
        earnedAt: new Date().toISOString(),
      },
      community: {
        id: 'community-leader',
        title: 'Community Leader',
        description: 'Sent 100+ chat messages',
        icon: 'Award',
        type: 'community' as const,
        earnedAt: new Date().toISOString(),
      },
      streak: {
        id: 'weekly-warrior',
        title: 'Weekly Warrior',
        description: 'Logged in continuously for 7+ days',
        icon: 'Calendar',
        type: 'streak' as const,
        earnedAt: new Date().toISOString(),
      }
    };

    const testBadge = testBadges[badgeType as keyof typeof testBadges] || testBadges.security;

    // Test sending email to yashabalam707@gmail.com
    const result = await BadgeEmailService.sendBadgeEarnedEmail({
      userId: 'test-user',
      userEmail: 'yashabalam707@gmail.com',
      userName: 'Yashab Alam',
      badge: testBadge,
      totalBadges: 5,
      nextBadgeHint: 'Keep engaging to unlock more badges!'
    });

    return NextResponse.json({
      success: true,
      message: `Test ${badgeType} badge email sent to yashabalam707@gmail.com`,
      result,
      badge: testBadge
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
