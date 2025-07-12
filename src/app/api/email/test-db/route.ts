import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// Simple test endpoint to verify email system database
export async function GET() {
  try {
    // Test basic query on email templates
    const templateCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM email_templates`;
    const logCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM email_logs`;
    const statsCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM email_stats`;

    return NextResponse.json({
      success: true,
      message: 'Email system database is working',
      counts: {
        templates: templateCount,
        logs: logCount,
        stats: statsCount
      }
    });
  } catch (error) {
    console.error('Email system database test failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Email system database test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
