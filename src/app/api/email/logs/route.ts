import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/email/logs - Get email activity logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const recipient = searchParams.get('recipient');
    const templateId = searchParams.get('templateId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build where clause for filtering
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (recipient) {
      where.recipient = {
        contains: recipient,
        mode: 'insensitive'
      };
    }
    
    if (templateId) {
      where.templateId = templateId;
    }
    
    if (dateFrom) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(dateFrom)
      };
    }
    
    if (dateTo) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(dateTo)
      };
    }

    const offset = (page - 1) * limit;

    // Get logs with template information
    const logs = await prisma.emailLog.findMany({
      where,
      include: {
        template: {
          select: {
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    });

    // Get total count
    const total = await prisma.emailLog.count({
      where
    });

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email logs' },
      { status: 500 }
    );
  }
}

// POST /api/email/logs - Create new email log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      templateId,
      recipient,
      subject,
      status = 'PENDING',
      messageId,
      metadata
    } = body;

    if (!recipient || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await prisma.$executeRaw`
      INSERT INTO email_logs (id, template_id, recipient, subject, status, message_id, metadata, attempts, created_at, updated_at)
      VALUES (${logId}, ${templateId}, ${recipient}, ${subject}, ${status}, ${messageId}, ${JSON.stringify(metadata)}, 0, NOW(), NOW())
    `;

    // Get the created log
    const log = await prisma.$queryRaw`
      SELECT 
        l.*,
        t.name as template_name,
        t.type as template_type
      FROM email_logs l
      LEFT JOIN email_templates t ON l.template_id = t.id
      WHERE l.id = ${logId}
    `;

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Error creating email log:', error);
    return NextResponse.json(
      { error: 'Failed to create email log' },
      { status: 500 }
    );
  }
}
