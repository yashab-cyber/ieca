import { NextRequest, NextResponse } from 'next/server';
import { PasswordService } from '@/lib/services/password-service';
import { BadgeEmailService } from '@/lib/services/badge-email-service';
import { authenticateUser } from '@/lib/auth';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Get user info for confirmation email
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Change password
    const success = await PasswordService.changePassword(
      authResult.user.id,
      currentPassword,
      newPassword
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Send password change confirmation email
    const badgeEmailService = new BadgeEmailService();
    await badgeEmailService.sendPasswordChangeConfirmationEmail(
      user.email,
      user.name
    );

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while changing your password' },
      { status: 500 }
    );
  }
}
