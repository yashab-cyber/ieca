import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/services';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updatedNotification = await notificationService.markAsRead(id);

    return NextResponse.json({
      success: true,
      message: "Notification marked as read!",
      data: updatedNotification,
    });

  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await notificationService.deleteNotification(id);

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully!",
    });

  } catch (error) {
    console.error('Notification deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
