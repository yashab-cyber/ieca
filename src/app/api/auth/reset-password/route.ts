import { NextRequest, NextResponse } from 'next/server';
import { PasswordService } from '@/lib/services/password-service';
import { BadgeEmailService } from '@/lib/services/badge-email-service';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Reset token and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Get user info before resetting password (for confirmation email)
    // Using raw SQL as workaround for Prisma client cache issue
    const users = await prisma.$queryRaw<Array<{id: string, email: string, name: string}>>`
      SELECT id, email, name 
      FROM "User" 
      WHERE "resetToken" = ${token} 
      AND "resetTokenExpiry" > NOW()
      LIMIT 1
    `;
    
    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Reset password
    const success = await PasswordService.resetPasswordWithToken(token, newPassword);

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
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
      { message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while resetting your password' },
      { status: 500 }
    );
  }
}
