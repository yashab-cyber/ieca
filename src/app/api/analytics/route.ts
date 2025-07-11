import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication middleware to ensure only admins can access this
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'dashboard':
        const dashboardStats = await analyticsService.getDashboardStats();
        return NextResponse.json({
          success: true,
          data: dashboardStats,
        });

      case 'applications':
        const applicationStats = await analyticsService.getApplicationStats();
        return NextResponse.json({
          success: true,
          data: applicationStats,
        });

      case 'growth':
        const days = parseInt(searchParams.get('days') || '30');
        const userGrowth = await analyticsService.getUserGrowth(days);
        return NextResponse.json({
          success: true,
          data: userGrowth,
        });

      default:
        // Return all analytics data
        const [dashboard, applications, growth] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getApplicationStats(),
          analyticsService.getUserGrowth(30),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            dashboard,
            applications,
            growth,
          },
        });
    }

  } catch (error) {
    console.error('Analytics API error:', error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to fetch analytics data",
    }, { status: 500 });
  }
}
