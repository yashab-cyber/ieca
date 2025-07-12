import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/security/ip-logger/logs - Get IP logs with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const country = searchParams.get('country');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};
    
    if (sessionId) {
      where.usageId = sessionId;
    }
    
    if (country && country !== 'all') {
      where.country = country;
    }

    const logs = await (prisma as any).ipLogEntry.findMany({
      where,
      orderBy: {
        clickedAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Transform logs to match frontend interface
    const transformedLogs = logs.map((log: any) => ({
      id: log.id,
      sessionId: log.usageId || log.sessionId,
      ipAddress: log.ipAddress || 'Unknown',
      userAgent: log.userAgent || 'Unknown',
      country: log.country || 'Unknown',
      city: log.city || 'Unknown',
      region: log.region || 'Unknown',
      timezone: log.timezone || 'Unknown',
      isp: log.isp || 'Unknown',
      device: log.device || 'Unknown',
      browser: log.browser || 'Unknown',
      os: log.os || 'Unknown',
      referer: log.referer,
      clickedAt: log.clickedAt?.toISOString() || log.createdAt?.toISOString()
    }));

    return NextResponse.json({
      logs: transformedLogs,
      total: logs.length,
      hasMore: logs.length === limit
    });
  } catch (error) {
    console.error('Error fetching IP logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
