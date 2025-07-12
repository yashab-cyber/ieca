import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/email/stats - Get email statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Get daily stats
    const stats = await prisma.$queryRaw`
      SELECT * FROM email_stats
      WHERE date >= ${startDate} AND date <= ${endDate}
      ORDER BY date DESC
    ` as any[];

    // Calculate totals
    const totals = stats.reduce((acc: any, stat: any) => ({
      totalSent: acc.totalSent + Number(stat.total_sent || 0),
      totalDelivered: acc.totalDelivered + Number(stat.total_delivered || 0),
      totalOpened: acc.totalOpened + Number(stat.total_opened || 0),
      totalClicked: acc.totalClicked + Number(stat.total_clicked || 0),
      totalFailed: acc.totalFailed + Number(stat.total_failed || 0),
      totalBounced: acc.totalBounced + Number(stat.total_bounced || 0)
    }), {
      totalSent: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalFailed: 0,
      totalBounced: 0
    });

    // Calculate rates
    const deliveryRate = totals.totalSent > 0 
      ? Math.round((totals.totalDelivered / totals.totalSent) * 100) 
      : 0;
    
    const openRate = totals.totalDelivered > 0 
      ? Math.round((totals.totalOpened / totals.totalDelivered) * 100) 
      : 0;
    
    const clickRate = totals.totalOpened > 0 
      ? Math.round((totals.totalClicked / totals.totalOpened) * 100) 
      : 0;

    // Get recent activity from logs
    const recentActivity = await prisma.$queryRaw`
      SELECT 
        l.*,
        t.name as template_name,
        t.type as template_type
      FROM email_logs l
      LEFT JOIN email_templates t ON l.template_id = t.id
      ORDER BY l.created_at DESC
      LIMIT 10
    ` as any[];

    return NextResponse.json({
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      },
      totals: {
        ...totals,
        deliveryRate,
        openRate,
        clickRate
      },
      dailyStats: stats,
      recentActivity: recentActivity.map((activity: any) => ({
        id: activity.id,
        type: activity.template_type || 'unknown',
        recipient: activity.recipient,
        subject: activity.subject,
        status: activity.status?.toLowerCase() || 'pending',
        timestamp: activity.created_at,
        messageId: activity.message_id
      }))
    });
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email statistics' },
      { status: 500 }
    );
  }
}

// POST /api/email/stats - Update daily email statistics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      totalSent = 0,
      totalDelivered = 0,
      totalOpened = 0,
      totalClicked = 0,
      totalFailed = 0,
      totalBounced = 0
    } = body;

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    const statDate = new Date(date);
    statDate.setHours(0, 0, 0, 0); // Reset time to start of day

    // Upsert stats for the given date
    await prisma.$executeRaw`
      INSERT INTO email_stats (id, date, total_sent, total_delivered, total_opened, total_clicked, total_failed, total_bounced)
      VALUES (${`stats_${Date.now()}`}, ${statDate}, ${totalSent}, ${totalDelivered}, ${totalOpened}, ${totalClicked}, ${totalFailed}, ${totalBounced})
      ON CONFLICT (date) DO UPDATE SET
        total_sent = EXCLUDED.total_sent,
        total_delivered = EXCLUDED.total_delivered,
        total_opened = EXCLUDED.total_opened,
        total_clicked = EXCLUDED.total_clicked,
        total_failed = EXCLUDED.total_failed,
        total_bounced = EXCLUDED.total_bounced
    `;

    // Get the updated stats
    const stats = await prisma.$queryRaw`
      SELECT * FROM email_stats WHERE date = ${statDate}
    ` as any[];

    return NextResponse.json(stats[0], { status: 201 });
  } catch (error) {
    console.error('Error updating email stats:', error);
    return NextResponse.json(
      { error: 'Failed to update email statistics' },
      { status: 500 }
    );
  }
}
