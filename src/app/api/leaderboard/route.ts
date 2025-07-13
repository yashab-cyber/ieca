import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get all members with their profiles and activity data
    const members = await prisma.user.findMany({
      where: {
        role: 'MEMBER',
        isActive: true,
      },
      include: {
        profile: true,
        securityUsage: {
          where: {
            status: 'COMPLETED',
          },
        },
        securityScans: {
          where: {
            status: 'COMPLETED',
          },
        },
        vulnerabilityReports: true,
        chatMessages: true,
        blogPosts: {
          where: {
            status: 'PUBLISHED',
          },
        },
        applications: {
          where: {
            status: 'APPROVED',
          },
        },
        _count: {
          select: {
            securityUsage: {
              where: {
                status: 'COMPLETED',
              },
            },
            securityScans: {
              where: {
                status: 'COMPLETED',
              },
            },
            vulnerabilityReports: true,
            chatMessages: true,
            blogPosts: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
    });

    // Calculate real activity-based points and create leaderboard
    const leaderboard = members
      .map((member) => {
        // Calculate points based on real activity
        const securityToolUsage = member._count.securityUsage * 50; // 50 points per security tool usage
        const securityScans = member._count.securityScans * 100; // 100 points per completed scan
        const vulnerabilityReports = member._count.vulnerabilityReports * 200; // 200 points per vulnerability report
        const blogPosts = member._count.blogPosts * 150; // 150 points per published blog post
        const chatActivity = Math.min(member._count.chatMessages * 2, 500); // 2 points per chat message, capped at 500
        const profilePoints = member.profile?.points || 0;
        
        // Total calculated points
        const totalPoints = securityToolUsage + securityScans + vulnerabilityReports + blogPosts + chatActivity + profilePoints;
        
        // Calculate total activities (missions)
        const totalActivities = member._count.securityUsage + member._count.securityScans + member._count.vulnerabilityReports + member._count.blogPosts;
        
        // Determine rank title based on points
        let rankTitle = 'Rookie';
        if (totalPoints >= 5000) rankTitle = 'Master Hacker';
        else if (totalPoints >= 3000) rankTitle = 'Expert';
        else if (totalPoints >= 2000) rankTitle = 'Advanced';
        else if (totalPoints >= 1000) rankTitle = 'Intermediate';
        else if (totalPoints >= 500) rankTitle = 'Apprentice';
        else if (totalPoints >= 100) rankTitle = 'Novice';
        
        // Calculate reputation based on vulnerability reports and blog posts
        const reputation = (member._count.vulnerabilityReports * 10) + (member._count.blogPosts * 5) + (member.profile?.reputation || 0);
        
        return {
          id: member.id,
          name: member.name,
          points: totalPoints,
          reputation,
          rank_title: rankTitle,
          completedMissions: totalActivities,
          avatar: member.profile?.avatar || `/api/avatar/${member.id}`,
          securityUsage: member._count.securityUsage,
          securityScans: member._count.securityScans,
          vulnerabilityReports: member._count.vulnerabilityReports,
          blogPosts: member._count.blogPosts,
          chatMessages: member._count.chatMessages,
          joinedAt: member.profile?.joinedAt || member.createdAt,
          lastActive: member.lastLoginAt,
        };
      })
      .filter(member => member.points > 0) // Only show members with activity
      .sort((a, b) => b.points - a.points) // Sort by points descending
      .map((member, index) => ({
        ...member,
        rank: index + 1,
      }));

    return NextResponse.json({
      success: true,
      data: leaderboard,
      totalMembers: members.length,
      activeMembers: leaderboard.length,
    });

  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
