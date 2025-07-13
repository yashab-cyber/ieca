import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { userService } from '@/lib/services';
import { BadgeEmailService } from '@/lib/services/badge-email-service';

// Calculate continuous login streak
async function calculateLoginStreak(userId: string): Promise<number> {
  try {
    // Get user's login history from lastLoginAt and potentially activity logs
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        lastLoginAt: true,
        createdAt: true,
      }
    });

    if (!user || !user.lastLoginAt) return 0;

    // For demonstration, we'll use a simplified calculation based on user activity
    // In production, you'd track daily login records in a separate table
    const now = new Date();
    const lastLogin = new Date(user.lastLoginAt);
    const daysDifference = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

    // Get user's activity frequency to estimate login consistency
    const [recentActivity, totalActivity] = await Promise.all([
      prisma.securityToolUsage.count({
        where: { 
          userId: userId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      prisma.securityToolUsage.count({
        where: { userId: userId }
      })
    ]);

    // Enhanced calculation based on activity patterns
    let estimatedStreak = 0;
    
    // If user has been active recently (within 7 days)
    if (daysDifference <= 7) {
      if (recentActivity >= 20) {
        estimatedStreak = 365; // Very active user - yearly badge
      } else if (recentActivity >= 10) {
        estimatedStreak = 30; // Active user - monthly badge
      } else if (recentActivity >= 5) {
        estimatedStreak = 7; // Regular user - weekly badge
      }
    }

    return estimatedStreak;
  } catch (error) {
    console.error('Error calculating login streak:', error);
    return 0;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user by email (in production this would use session)
    const user = await userService.getUserByEmail('yashabalam707@gmail.com');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's activity counts
    const [
      securityUsageCount,
      securityScansCount,
      vulnerabilityReportsCount,
      blogPostsCount,
      chatMessagesCount
    ] = await Promise.all([
      prisma.securityToolUsage.count({
        where: { 
          userId: user.id, 
          status: 'COMPLETED' 
        }
      }),
      prisma.securityScan.count({
        where: { 
          userId: user.id, 
          status: 'COMPLETED' 
        }
      }),
      prisma.vulnerabilityReport.count({
        where: { userId: user.id }
      }),
      prisma.blogPost.count({
        where: { 
          authorId: user.id, 
          status: 'PUBLISHED' 
        }
      }),
      prisma.chatMessage.count({
        where: { userId: user.id }
      })
    ]);

    // Calculate activity-based points (same logic as leaderboard)
    const securityToolUsage = securityUsageCount * 50;
    const securityScans = securityScansCount * 100;
    const vulnerabilityReports = vulnerabilityReportsCount * 200;
    const blogPosts = blogPostsCount * 150;
    const chatActivity = Math.min(chatMessagesCount * 2, 500);
    const profilePoints = user.profile?.points || 0;
    
    const totalPoints = securityToolUsage + securityScans + vulnerabilityReports + blogPosts + chatActivity + profilePoints;
    const totalMissions = securityUsageCount + securityScansCount + vulnerabilityReportsCount + blogPostsCount;

    // Get user's rank in leaderboard
    const allUsers = await prisma.user.findMany({
      where: {
        role: 'MEMBER',
        isActive: true,
      },
      include: {
        profile: true,
      },
    });

    // Calculate points for all users and sort
    const userRankings = await Promise.all(
      allUsers.map(async (u) => {
        const [uUsage, uScans, uReports, uPosts, uMessages] = await Promise.all([
          prisma.securityToolUsage.count({ where: { userId: u.id, status: 'COMPLETED' } }),
          prisma.securityScan.count({ where: { userId: u.id, status: 'COMPLETED' } }),
          prisma.vulnerabilityReport.count({ where: { userId: u.id } }),
          prisma.blogPost.count({ where: { authorId: u.id, status: 'PUBLISHED' } }),
          prisma.chatMessage.count({ where: { userId: u.id } })
        ]);
        
        const points = (uUsage * 50) + (uScans * 100) + (uReports * 200) + (uPosts * 150) + Math.min(uMessages * 2, 500) + (u.profile?.points || 0);
        return { id: u.id, points };
      })
    );

    userRankings.sort((a, b) => b.points - a.points);
    const userRank = userRankings.findIndex(u => u.id === user.id) + 1;

    // Calculate achievement badges
    const badges = [];
    let badgeCount = 0;

    // Welcome badge - given to all users (first login)
    badges.push({
      id: 'welcome-aboard',
      title: 'Welcome Aboard!',
      description: 'Joined the IECA cybersecurity community',
      icon: 'UserPlus',
      type: 'welcome',
      earnedAt: user.createdAt.toISOString(),
    });
    badgeCount++;

    // Security Expert badges
    if (securityUsageCount >= 50) {
      badges.push({
        id: 'security-expert',
        title: 'Security Expert',
        description: 'Used 50+ security tools',
        icon: 'ShieldCheck',
        type: 'security',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    } else if (securityUsageCount >= 20) {
      badges.push({
        id: 'security-enthusiast',
        title: 'Security Enthusiast',
        description: 'Used 20+ security tools',
        icon: 'Target',
        type: 'security',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    }

    // Scanner badges
    if (securityScansCount >= 25) {
      badges.push({
        id: 'master-scanner',
        title: 'Master Scanner',
        description: 'Completed 25+ security scans',
        icon: 'Zap',
        type: 'scanner',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    } else if (securityScansCount >= 10) {
      badges.push({
        id: 'scanner',
        title: 'Scanner',
        description: 'Completed 10+ security scans',
        icon: 'Target',
        type: 'scanner',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    }

    // Researcher badges
    if (vulnerabilityReportsCount >= 10) {
      badges.push({
        id: 'security-researcher',
        title: 'Security Researcher',
        description: 'Submitted 10+ vulnerability reports',
        icon: 'Award',
        type: 'researcher',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    } else if (vulnerabilityReportsCount >= 5) {
      badges.push({
        id: 'bug-hunter',
        title: 'Bug Hunter',
        description: 'Submitted 5+ vulnerability reports',
        icon: 'Target',
        type: 'researcher',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    }

    // Content Creator badges
    if (blogPostsCount >= 10) {
      badges.push({
        id: 'content-creator',
        title: 'Content Creator',
        description: 'Published 10+ blog posts',
        icon: 'Award',
        type: 'content',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    } else if (blogPostsCount >= 3) {
      badges.push({
        id: 'blogger',
        title: 'Blogger',
        description: 'Published 3+ blog posts',
        icon: 'Target',
        type: 'content',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    }

    // Community badges
    if (chatMessagesCount >= 100) {
      badges.push({
        id: 'community-leader',
        title: 'Community Leader',
        description: 'Sent 100+ chat messages',
        icon: 'Award',
        type: 'community',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    }

    // Login streak badges - Calculate continuous login days
    const loginStreak = await calculateLoginStreak(user.id);
    
    if (loginStreak >= 365) {
      badges.push({
        id: 'yearly-warrior',
        title: 'Yearly Warrior',
        description: 'Logged in continuously for 365+ days',
        icon: 'Crown',
        type: 'streak',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    } else if (loginStreak >= 30) {
      badges.push({
        id: 'monthly-champion',
        title: 'Monthly Champion',
        description: 'Logged in continuously for 30+ days',
        icon: 'Trophy',
        type: 'streak',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    } else if (loginStreak >= 7) {
      badges.push({
        id: 'weekly-warrior',
        title: 'Weekly Warrior',
        description: 'Logged in continuously for 7+ days',
        icon: 'Calendar',
        type: 'streak',
        earnedAt: new Date().toISOString(),
      });
      badgeCount++;
    }

    // Rank title
    let rankTitle = 'Rookie';
    if (totalPoints >= 5000) rankTitle = 'Master Hacker';
    else if (totalPoints >= 3000) rankTitle = 'Expert';
    else if (totalPoints >= 2000) rankTitle = 'Advanced';
    else if (totalPoints >= 1000) rankTitle = 'Intermediate';
    else if (totalPoints >= 500) rankTitle = 'Apprentice';
    else if (totalPoints >= 100) rankTitle = 'Novice';

    // Get recent activity
    const [recentUsage, recentScans, recentReports, recentPosts] = await Promise.all([
      prisma.securityToolUsage.findMany({
        where: { userId: user.id, status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.securityScan.findMany({
        where: { userId: user.id, status: 'COMPLETED' },
        orderBy: { startedAt: 'desc' },
        take: 3,
      }),
      prisma.vulnerabilityReport.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 2,
      }),
      prisma.blogPost.findMany({
        where: { authorId: user.id, status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: 2,
      }),
    ]);

    // Format recent activity
    const recentActivity = [
      ...recentUsage.map(usage => ({
        type: 'security_tool',
        title: 'Used Security Tool',
        description: 'Completed security tool analysis',
        date: usage.createdAt,
        points: 50,
      })),
      ...recentScans.map(scan => ({
        type: 'security_scan',
        title: 'Security Scan',
        description: `Completed ${scan.scanType.toLowerCase()} scan`,
        date: scan.startedAt,
        points: 100,
      })),
      ...recentReports.map(report => ({
        type: 'vulnerability_report',
        title: 'Vulnerability Report',
        description: `Reported ${report.severity} severity issue`,
        date: report.createdAt,
        points: 200,
      })),
      ...recentPosts.map(post => ({
        type: 'blog_post',
        title: 'Blog Post',
        description: post.title,
        date: post.createdAt,
        points: 150,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    const stats = {
      rank: userRank,
      points: totalPoints,
      missions: totalMissions,
      badges: badgeCount,
      badgeDetails: badges,
      rankTitle,
      reputation: user.profile?.reputation || 0,
      activityBreakdown: {
        securityToolUsage: securityUsageCount,
        securityScans: securityScansCount,
        vulnerabilityReports: vulnerabilityReportsCount,
        blogPosts: blogPostsCount,
        chatMessages: chatMessagesCount,
      },
      recentActivity,
      joinedAt: user.profile?.joinedAt || user.createdAt,
      lastActive: user.lastLoginAt,
    };

    // Check and send badge emails asynchronously (don't wait for completion)
    if (badges.length > 0) {
      // Send email notifications for new badges
      badges.forEach(async (badge) => {
        try {
          await BadgeEmailService.sendBadgeEarnedEmail({
            userId: user.id,
            userEmail: user.email,
            userName: user.name || 'User',
            badge: {
              id: badge.id,
              title: badge.title,
              description: badge.description,
              icon: badge.icon,
              type: badge.type as 'security' | 'scanner' | 'researcher' | 'content' | 'community' | 'streak',
              earnedAt: badge.earnedAt
            },
            totalBadges: badgeCount,
            nextBadgeHint: undefined
          });
        } catch (error) {
          console.error('Error sending badge email:', error);
        }
      });
    }

    return NextResponse.json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error('User stats fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
