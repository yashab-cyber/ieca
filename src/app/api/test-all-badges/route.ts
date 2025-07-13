import { NextRequest, NextResponse } from 'next/server';
import { BadgeEmailService } from '@/lib/services/badge-email-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const preview = searchParams.get('preview') === 'true';
    
    // All badge types to test
    const testBadges = [
      {
        id: 'security-expert',
        title: 'Security Expert',
        description: 'Used 50+ security tools',
        icon: 'ShieldCheck',
        type: 'security' as const,
        earnedAt: new Date().toISOString(),
      },
      {
        id: 'master-scanner',
        title: 'Master Scanner',
        description: 'Completed 25+ security scans',
        icon: 'Zap',
        type: 'scanner' as const,
        earnedAt: new Date().toISOString(),
      },
      {
        id: 'bug-hunter',
        title: 'Bug Hunter',
        description: 'Submitted 5+ vulnerability reports',
        icon: 'Award',
        type: 'researcher' as const,
        earnedAt: new Date().toISOString(),
      },
      {
        id: 'content-creator',
        title: 'Content Creator',
        description: 'Published 10+ blog posts',
        icon: 'Target',
        type: 'content' as const,
        earnedAt: new Date().toISOString(),
      },
      {
        id: 'community-leader',
        title: 'Community Leader',
        description: 'Sent 100+ chat messages',
        icon: 'Award',
        type: 'community' as const,
        earnedAt: new Date().toISOString(),
      },
      {
        id: 'weekly-warrior',
        title: 'Weekly Warrior',
        description: 'Logged in continuously for 7+ days',
        icon: 'Calendar',
        type: 'streak' as const,
        earnedAt: new Date().toISOString(),
      }
    ];

    if (preview) {
      // Generate preview HTML for all badges
      const previews = testBadges.map(badge => {
        const emailHtml = BadgeEmailService.generateEmailHTML({
          userName: 'Yashab Alam',
          badgeTitle: badge.title,
          badgeDescription: badge.description,
          badgeType: badge.type,
          totalBadges: 12,
          nextBadgeHint: 'Keep engaging to unlock more badges!'
        });
        
        return {
          badgeType: badge.type,
          badgeTitle: badge.title,
          html: emailHtml
        };
      });

      return NextResponse.json({
        success: true,
        message: 'Email previews generated',
        previews: previews
      });
    } else {
      // Send actual test emails for all badge types
      const results = [];
      
      for (const badge of testBadges) {
        try {
          const result = await BadgeEmailService.sendBadgeEarnedEmail({
            userId: 'test-user',
            userEmail: 'yashabalam707@gmail.com',
            userName: 'Yashab Alam',
            badge: badge,
            totalBadges: 12,
            nextBadgeHint: 'Keep engaging to unlock more badges!'
          });

          results.push({
            badgeType: badge.type,
            badgeTitle: badge.title,
            success: result,
            message: result ? 'Email sent successfully' : 'Email failed to send'
          });

          // Add delay between emails to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          results.push({
            badgeType: badge.type,
            badgeTitle: badge.title,
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Test emails sent to yashabalam707@gmail.com`,
        results: results,
        totalSent: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length
      });
    }
    
  } catch (error) {
    console.error('Error testing all badge emails:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to test badge emails' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, userName } = await request.json();
    
    // Test badge for manual testing
    const testBadge = {
      id: 'security-expert',
      title: 'Security Expert',
      description: 'Used 50+ security tools - TEST EMAIL',
      icon: 'ShieldCheck',
      type: 'security' as const,
      earnedAt: new Date().toISOString(),
    };
    
    // Send single test email
    const result = await BadgeEmailService.sendBadgeEarnedEmail({
      userId: 'test-user',
      userEmail: email || 'yashabalam707@gmail.com',
      userName: userName || 'Test User',
      badge: testBadge,
      totalBadges: 1,
      nextBadgeHint: 'This is a test email - Keep engaging to unlock more badges!'
    });
    
    return NextResponse.json({
      success: result,
      message: result ? `Test email sent to ${email || 'yashabalam707@gmail.com'}` : 'Failed to send test email',
      badge: testBadge
    });
    
  } catch (error) {
    console.error('Manual test email error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send manual test email', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
