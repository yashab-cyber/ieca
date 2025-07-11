import { NextRequest, NextResponse } from 'next/server';
import { userService, applicationService, resourceService, notificationService, analyticsService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication middleware to ensure only admins can access this
    
    // Get comprehensive admin dashboard statistics
    const [users, applications, resources, notifications] = await Promise.all([
      userService.getAllUsers(),
      applicationService.getAllApplications(),
      resourceService.getAllResources(),
      notificationService.getAllNotifications(),
    ]);

    // Calculate statistics
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.isActive).length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'PENDING').length,
      approvedApplications: applications.filter(app => app.status === 'APPROVED').length,
      totalResources: resources.length,
      publishedResources: resources.filter(resource => resource.status === 'PUBLISHED').length,
      totalNotifications: notifications.length,
      unreadNotifications: notifications.filter(notification => !notification.isRead).length,
      
      // User roles breakdown
      userRoles: {
        admins: users.filter(user => user.role === 'ADMIN').length,
        moderators: users.filter(user => user.role === 'MODERATOR').length,
        members: users.filter(user => user.role === 'MEMBER').length,
      },
      
      // Recent activity
      recentUsers: users.slice(0, 5).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })),
      
      recentApplications: applications.slice(0, 5).map(app => ({
        id: app.id,
        name: app.name,
        email: app.email,
        status: app.status,
        createdAt: app.createdAt,
      })),
      
      recentResources: resources.slice(0, 5).map(resource => ({
        id: resource.id,
        title: resource.title,
        authorName: resource.authorName,
        status: resource.status,
        createdAt: resource.createdAt,
      })),
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to fetch admin dashboard data",
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication middleware to ensure only admins can access this
    
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'bulkUpdateApplications':
        const { applicationIds, status } = data;
        const results = await Promise.all(
          applicationIds.map((id: string) => 
            applicationService.updateApplicationStatus(id, status, 'admin', 'Bulk update')
          )
        );
        
        return NextResponse.json({
          success: true,
          message: `${results.length} applications updated to ${status}`,
          data: results,
        });

      case 'createGlobalNotification':
        const { title, message, type } = data;
        const notification = await notificationService.createNotification({
          title,
          message,
          type,
          isGlobal: true,
        });
        
        return NextResponse.json({
          success: true,
          message: 'Global notification created successfully',
          data: notification,
        });

      case 'systemCleanup':
        // Archive old notifications, cleanup inactive users, etc.
        const cleanupResults = {
          notificationsArchived: 0,
          usersDeactivated: 0,
        };
        
        // This would be implemented based on specific cleanup requirements
        return NextResponse.json({
          success: true,
          message: 'System cleanup completed',
          data: cleanupResults,
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid admin action',
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Admin action error:', error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to perform admin action",
    }, { status: 500 });
  }
}
