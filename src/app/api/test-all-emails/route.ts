import { NextRequest, NextResponse } from 'next/server';
import { BadgeEmailService } from '@/lib/services/badge-email-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'yashabalam707@gmail.com';
    const testType = searchParams.get('test') || 'all';
    
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
        id: 'content-creator',
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

    const results = [];
    
    if (testType === 'all') {
      // Test all badge types
      for (const [badgeType, badge] of Object.entries(testBadges)) {
        try {
          const result = await BadgeEmailService.sendBadgeEarnedEmail({
            userId: 'test-user',
            userEmail: email,
            userName: 'Test User',
            badge,
            totalBadges: 12,
            nextBadgeHint: `Keep engaging to unlock more ${badgeType} badges!`
          });
          
          results.push({
            badgeType,
            badge: badge.title,
            success: result,
            message: result ? 'Email sent successfully' : 'Failed to send email'
          });
          
          // Add delay between emails to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          results.push({
            badgeType,
            badge: badge.title,
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    } else {
      // Test specific badge type
      const badge = testBadges[testType as keyof typeof testBadges];
      if (!badge) {
        return NextResponse.json({
          success: false,
          message: 'Invalid badge type'
        }, { status: 400 });
      }
      
      const result = await BadgeEmailService.sendBadgeEarnedEmail({
        userId: 'test-user',
        userEmail: email,
        userName: 'Test User',
        badge,
        totalBadges: 12,
        nextBadgeHint: `Keep engaging to unlock more ${testType} badges!`
      });
      
      results.push({
        badgeType: testType,
        badge: badge.title,
        success: result,
        message: result ? 'Email sent successfully' : 'Failed to send email'
      });
    }

    return NextResponse.json({
      success: true,
      message: `Test emails sent to ${email}`,
      results,
      totalTests: results.length,
      successCount: results.filter(r => r.success).length,
      failCount: results.filter(r => !r.success).length
    });

  } catch (error) {
    console.error('Test emails error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send test emails',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, badgeTypes, userName } = await request.json();
    
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
        id: 'content-creator',
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

    const results = [];
    const typesToTest = badgeTypes || Object.keys(testBadges);
    
    for (const badgeType of typesToTest) {
      const badge = testBadges[badgeType as keyof typeof testBadges];
      if (!badge) continue;
      
      try {
        const result = await BadgeEmailService.sendBadgeEarnedEmail({
          userId: 'test-user',
          userEmail: email || 'yashabalam707@gmail.com',
          userName: userName || 'Test User',
          badge,
          totalBadges: 12,
          nextBadgeHint: `Keep engaging to unlock more ${badgeType} badges!`
        });
        
        results.push({
          badgeType,
          badge: badge.title,
          success: result,
          message: result ? 'Email sent successfully' : 'Failed to send email'
        });
        
        // Add delay between emails
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        results.push({
          badgeType,
          badge: badge.title,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Test emails sent to ${email || 'yashabalam707@gmail.com'}`,
      results,
      totalTests: results.length,
      successCount: results.filter(r => r.success).length,
      failCount: results.filter(r => !r.success).length
    });

  } catch (error) {
    console.error('Test emails error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send test emails',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
