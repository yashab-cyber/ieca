import { NextRequest, NextResponse } from 'next/server';
import { BadgeEmailService } from '@/lib/services/badge-email-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || 'security';
  const preview = searchParams.get('preview') === 'true';
  
  try {
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
        title: 'Content Creator',
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

    const testBadge = testBadges[template as keyof typeof testBadges] || testBadges.security;

    if (preview) {
      // Generate and return HTML preview
      const emailHtml = BadgeEmailService.generateEmailHTML({
        userName: 'John Doe',
        badgeTitle: testBadge.title,
        badgeDescription: testBadge.description,
        badgeType: testBadge.type,
        totalBadges: 12,
        nextBadgeHint: 'Keep engaging to unlock more badges!'
      });

      return new NextResponse(emailHtml, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } else {
      // Send actual test email
      const result = await BadgeEmailService.sendBadgeEarnedEmail({
        userId: 'test-user',
        userEmail: 'yashabalam707@gmail.com',
        userName: 'Yashab Alam',
        badge: testBadge,
        totalBadges: 12,
        nextBadgeHint: 'Keep engaging to unlock more badges!'
      });

      return NextResponse.json({
        success: true,
        message: `Test ${template} badge email sent to yashabalam707@gmail.com`,
        result,
        badge: testBadge
      });
    }
    
  } catch (error) {
    console.error('Error with email template:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to process email template' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, badgeType, userName } = await request.json();
    
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
        title: 'Content Creator',
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
    
    // Send test email
    const result = await BadgeEmailService.sendBadgeEarnedEmail({
      userId: 'test-user',
      userEmail: email || 'yashabalam707@gmail.com',
      userName: userName || 'Test User',
      badge: testBadge,
      totalBadges: 12,
      nextBadgeHint: 'Keep engaging to unlock more badges!'
    });
    
    return NextResponse.json({
      success: result,
      message: result ? 'Test email sent successfully' : 'Failed to send test email',
      badge: testBadge
    });
    
  } catch (error) {
    console.error('Email template processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process email template', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
