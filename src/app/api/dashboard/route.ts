import { NextRequest, NextResponse } from 'next/server';
import { userService, applicationService, resourceService, analyticsService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    // Get dashboard statistics
    const [
      members,
      applications,
      resources,
      dashboardStats
    ] = await Promise.all([
      userService.getMembers(),
      applicationService.getAllApplications(),
      resourceService.getAllResources(),
      analyticsService.getDashboardStats()
    ]);

    const stats = {
      totalMembers: members.length,
      totalApplications: applications.length,
      totalResources: resources.length,
      pendingApplications: applications.filter(app => app.status === 'PENDING').length,
      approvedApplications: applications.filter(app => app.status === 'APPROVED').length,
      publishedResources: resources.filter(res => res.status === 'PUBLISHED').length,
      totalViews: resources.reduce((total, resource) => total + resource.views, 0),
      totalDownloads: resources.reduce((total, resource) => total + resource.downloads, 0),
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
