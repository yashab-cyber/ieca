import { NextRequest, NextResponse } from 'next/server';
import { PasswordService } from '@/lib/services/password-service';
import { BadgeEmailService } from '@/lib/services/badge-email-service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create password reset request
    const resetRequest = await PasswordService.createPasswordResetRequest(email);

    if (!resetRequest) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent.' },
        { status: 200 }
      );
    }

    // Send password reset email
    await BadgeEmailService.sendPasswordResetEmail(
      resetRequest.user.email,
      resetRequest.user.name,
      resetRequest.resetToken
    );

    return NextResponse.json(
      { message: 'If an account with that email exists, a reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
