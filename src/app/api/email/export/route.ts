import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/email/export - Export email logs as CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const format = searchParams.get('format') || 'csv';

    // Build where clause for filtering
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
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

    // Get all logs matching the criteria
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
      }
    });

    if (format === 'csv') {
      // Create CSV content
      const csvHeaders = [
        'ID',
        'Template Name',
        'Template Type',
        'Recipient',
        'Subject',
        'Status',
        'Message ID',
        'Attempts',
        'Created At',
        'Updated At'
      ];

      const csvRows = logs.map(log => [
        log.id,
        log.template?.name || '',
        log.template?.type || '',
        log.recipient,
        log.subject,
        log.status,
        log.messageId || '',
        log.attempts,
        log.createdAt.toISOString(),
        log.updatedAt.toISOString()
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => 
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="email-logs-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Default to JSON format
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error exporting email logs:', error);
    return NextResponse.json(
      { error: 'Failed to export email logs' },
      { status: 500 }
    );
  }
}
