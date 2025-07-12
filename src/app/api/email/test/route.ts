import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { type, email, name, data } = await request.json();

    if (!emailService.isConfigured()) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    let result = false;

    switch (type) {
      case 'test':
        result = await emailService.sendEmail(
          email,
          'IECA Email Test',
          'This is a test email from IECA platform.',
          '<h1>Test Email</h1><p>This is a test email from IECA platform.</p>'
        );
        break;

      case 'welcome':
        result = await emailService.sendWelcomeEmail(email, name);
        break;

      case 'application-confirmation':
        result = await emailService.sendApplicationConfirmation(
          email,
          name,
          data?.applicationId || 'TEST-APP-123'
        );
        break;

      case 'application-status':
        result = await emailService.sendApplicationStatusUpdate(
          email,
          name,
          data?.status || 'approved',
          data?.reason
        );
        break;

      case 'password-reset':
        result = await emailService.sendPasswordResetEmail(
          email,
          name,
          data?.resetToken || 'test-token-123'
        );
        break;

      case 'notification':
        result = await emailService.sendNotificationEmail(
          email,
          name,
          data?.title || 'Test Notification',
          data?.message || 'This is a test notification.'
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (result) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: emailService.isConfigured(),
    message: emailService.isConfigured() 
      ? 'Email service is configured and ready'
      : 'Email service is not configured. Please set SMTP environment variables.',
    supportedTypes: [
      'test',
      'welcome',
      'application-confirmation',
      'application-status',
      'password-reset',
      'notification'
    ]
  });
}
