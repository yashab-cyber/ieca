import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/services';
import { z } from 'zod';

const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR']),
  isGlobal: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = notificationSchema.parse(body);

    const notification = await notificationService.createNotification(validatedData);

    return NextResponse.json({
      success: true,
      message: "Notification created successfully!",
      data: notification,
    });

  } catch (error) {
    console.error('Notification creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let notifications;
    
    if (type === 'global') {
      notifications = await notificationService.getGlobalNotifications();
    } else {
      notifications = await notificationService.getAllNotifications();
    }

    return NextResponse.json({
      success: true,
      data: notifications,
    });

  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
