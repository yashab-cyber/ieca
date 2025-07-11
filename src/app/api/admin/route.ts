import { NextRequest, NextResponse } from 'next/server';
import { userService, applicationService, resourceService, notificationService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication middleware to ensure only admins can access this
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'users':
        const users = await userService.getAllUsers();
        return NextResponse.json({
          success: true,
          data: users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
          })),
        });

      case 'applications':
        const applications = await applicationService.getAllApplications();
        return NextResponse.json({
          success: true,
          data: applications,
        });

      case 'resources':
        const resources = await resourceService.getAllResources();
        return NextResponse.json({
          success: true,
          data: resources,
        });

      case 'notifications':
        const notifications = await notificationService.getAllNotifications();
        return NextResponse.json({
          success: true,
          data: notifications,
        });

      case 'stats':
        const [totalUsers, totalApplications, totalResources, totalNotifications] = await Promise.all([
          userService.getAllUsers().then(users => users.length),
          applicationService.getAllApplications().then(apps => apps.length),
          resourceService.getAllResources().then(resources => resources.length),
          notificationService.getAllNotifications().then(notifications => notifications.length),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            totalUsers,
            totalApplications,
            totalResources,
            totalNotifications,
            pendingApplications: await applicationService.getAllApplications()
              .then(apps => apps.filter(app => app.status === 'PENDING').length),
            activeUsers: await userService.getAllUsers()
              .then(users => users.filter(user => user.isActive).length),
          },
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid admin data type requested',
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Admin API error:', error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to fetch admin data",
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication middleware to ensure only admins can access this
    
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'toggleUserStatus':
        const { userId, isActive } = data;
        const updatedUser = await userService.updateUserProfile(userId, { isActive });
        return NextResponse.json({
          success: true,
          message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
          data: updatedUser,
        });

      case 'updateUserRole':
        const { userId: targetUserId, role } = data;
        const userWithNewRole = await userService.updateUserProfile(targetUserId, { role });
        return NextResponse.json({
          success: true,
          message: `User role updated to ${role}`,
          data: userWithNewRole,
        });

      case 'createNotification':
        const { title, message, type, isGlobal } = data;
        const notification = await notificationService.createNotification({
          title,
          message,
          type,
          isGlobal,
        });
        return NextResponse.json({
          success: true,
          message: 'Notification created successfully',
          data: notification,
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
