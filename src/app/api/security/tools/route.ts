import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get current user (in production, this should come from JWT token)
    const user = await userService.getUserByEmail('yashabalam707@gmail.com');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get all security tools from database
    const securityTools = await prisma.securityTool.findMany({
      include: {
        usage: {
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: { usage: true }
        }
      }
    });

    // Get security tool usage statistics
    const totalUsage = await prisma.securityToolUsage.count({
      where: { userId: user.id }
    });

    const completedScans = await prisma.securityToolUsage.count({
      where: { 
        userId: user.id,
        status: 'COMPLETED'
      }
    });

    const activeScans = await prisma.securityToolUsage.count({
      where: { 
        userId: user.id,
        status: 'PENDING'
      }
    });

    // Get vulnerability reports count
    const vulnerabilityReports = await prisma.vulnerabilityReport.count({
      where: { userId: user.id }
    });

    // Get recent activity
    const recentActivity = await prisma.securityToolUsage.findMany({
      where: { userId: user.id },
      include: {
        tool: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Format tools data
    const formattedTools = securityTools.map(tool => ({
      id: tool.id,
      name: tool.name,
      type: tool.type,
      description: tool.description,
      isActive: tool.isActive,
      usageCount: tool._count.usage,
      lastUsed: tool.usage[0]?.createdAt 
        ? formatTimeAgo(tool.usage[0].createdAt)
        : 'Never used'
    }));

    // Format recent activity
    const formattedActivity = recentActivity.map(activity => ({
      id: activity.id,
      action: `Used ${activity.tool.name}`,
      tool: activity.tool.name,
      status: activity.status.toLowerCase(),
      timestamp: formatTimeAgo(activity.createdAt)
    }));

    const stats = {
      totalTools: securityTools.length,
      activeScans,
      completedScans,
      vulnerabilitiesFound: vulnerabilityReports,
      recentActivity: formattedActivity
    };

    return NextResponse.json({
      success: true,
      tools: formattedTools,
      stats
    });

  } catch (error) {
    console.error('Security tools API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch security tools data' },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return date.toLocaleDateString();
}
