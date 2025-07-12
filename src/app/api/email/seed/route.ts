import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// Seed sample email templates and data
export async function POST() {
  try {
    console.log('Seeding email system data...');

    // Insert sample email templates using raw SQL
    await prisma.$executeRaw`
      INSERT INTO email_templates (id, name, type, subject, "htmlContent", "textContent", description, "isActive", "createdAt", "updatedAt")
      VALUES 
        ('template_1', 'Welcome Email', 'WELCOME', 'Welcome to IECA Platform', 
         '<h1>Welcome {{name}}!</h1><p>Thanks for joining IECA.</p>', 
         'Welcome {{name}}! Thanks for joining IECA.',
         'Welcome email for new users', true, NOW(), NOW()),
        ('template_2', 'Application Confirmation', 'APPLICATION_CONFIRMATION', 'Your Application Received',
         '<h1>Application Confirmed</h1><p>Dear {{name}}, we received your application.</p>',
         'Dear {{name}}, we received your application.',
         'Confirmation email for applications', true, NOW(), NOW()),
        ('template_3', 'Password Reset', 'PASSWORD_RESET', 'Reset Your Password',
         '<h1>Password Reset</h1><p>Click here to reset: {{resetLink}}</p>',
         'Password reset link: {{resetLink}}',
         'Password reset email', true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `;

    // Insert template variables
    await prisma.$executeRaw`
      INSERT INTO email_template_variables (id, "templateId", name, description, required, "defaultValue")
      VALUES 
        ('var_1', 'template_1', 'name', 'User full name', true, NULL),
        ('var_2', 'template_1', 'email', 'User email address', true, NULL),
        ('var_3', 'template_2', 'name', 'Applicant name', true, NULL),
        ('var_4', 'template_2', 'applicationId', 'Application ID', true, NULL),
        ('var_5', 'template_3', 'name', 'User name', true, NULL),
        ('var_6', 'template_3', 'resetLink', 'Password reset link', true, NULL)
      ON CONFLICT ("templateId", name) DO NOTHING;
    `;

    // Insert sample email logs
    await prisma.$executeRaw`
      INSERT INTO email_logs (id, "templateId", recipient, subject, status, "sentAt", "createdAt", "updatedAt")
      VALUES 
        ('log_1', 'template_1', 'user1@example.com', 'Welcome to IECA Platform', 'DELIVERED', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', NOW()),
        ('log_2', 'template_2', 'user2@example.com', 'Your Application Received', 'SENT', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', NOW()),
        ('log_3', 'template_3', 'user3@example.com', 'Reset Your Password', 'FAILED', NULL, NOW() - INTERVAL '30 minutes', NOW())
      ON CONFLICT (id) DO NOTHING;
    `;

    // Insert sample email stats
    await prisma.$executeRaw`
      INSERT INTO email_stats (id, date, "totalSent", "totalDelivered", "totalOpened", "totalClicked", "totalFailed", "totalBounced")
      VALUES 
        ('stats_1', CURRENT_DATE, 150, 143, 85, 32, 7, 2),
        ('stats_2', CURRENT_DATE - INTERVAL '1 day', 134, 128, 76, 28, 6, 1),
        ('stats_3', CURRENT_DATE - INTERVAL '2 days', 167, 159, 94, 41, 8, 3)
      ON CONFLICT (date) DO UPDATE SET
        "totalSent" = EXCLUDED."totalSent",
        "totalDelivered" = EXCLUDED."totalDelivered",
        "totalOpened" = EXCLUDED."totalOpened",
        "totalClicked" = EXCLUDED."totalClicked",
        "totalFailed" = EXCLUDED."totalFailed",
        "totalBounced" = EXCLUDED."totalBounced";
    `;

    // Get counts to verify
    const templateCount = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM email_templates`;
    const logCount = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM email_logs`;
    const statsCount = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM email_stats`;

    return NextResponse.json({
      success: true,
      message: 'Email system data seeded successfully',
      counts: {
        templates: templateCount,
        logs: logCount,
        stats: statsCount
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error seeding email data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to seed email data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
