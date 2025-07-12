import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// Simple API to get email stats for the dashboard
export async function GET() {
  try {
    // Get recent logs for activity
    const recentLogs = await prisma.$queryRaw`
      SELECT 
        id,
        recipient,
        subject,
        status,
        "createdAt",
        "templateId"
      FROM email_logs 
      ORDER BY "createdAt" DESC
      LIMIT 10
    ` as any[];

    // Get stats
    const statsData = await prisma.$queryRaw`
      SELECT 
        SUM("totalSent")::int as total_sent,
        SUM("totalDelivered")::int as total_delivered,
        SUM("totalFailed")::int as total_failed
      FROM email_stats
    ` as any[];

    const stats = statsData[0] || { total_sent: 0, total_delivered: 0, total_failed: 0 };

    // Format activity data
    const recentActivity = recentLogs.map((log: any) => ({
      id: log.id,
      type: 'email',
      recipient: log.recipient,
      subject: log.subject,
      status: log.status.toLowerCase(),
      timestamp: log.createdAt.toISOString(),
      messageId: `msg-${log.id}`
    }));

    // Calculate delivery rate
    const totalSent = stats.total_sent || 0;
    const totalDelivered = stats.total_delivered || 0;
    const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalSent: totalSent,
        totalDelivered: totalDelivered,
        totalFailed: stats.total_failed || 0,
        deliveryRate: deliveryRate,
        recentActivity: recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return NextResponse.json({
      success: false,
      stats: {
        totalSent: 0,
        totalDelivered: 0,
        totalFailed: 0,
        deliveryRate: 0,
        recentActivity: []
      },
      error: 'Failed to fetch stats'
    });
  }
}
