import { prisma } from '../src/lib/database';

async function seedEmailLogs() {
  console.log('🌱 Seeding email logs...');

  const testLogs = [
    {
      id: `log_${Date.now()}_001`,
      recipient: 'john.doe@example.com',
      subject: 'Welcome to IECA Platform',
      status: 'DELIVERED',
      messageId: 'msg_welcome_001',
      attempts: 1,
      metadata: { type: 'welcome' },
    },
    {
      id: `log_${Date.now()}_002`,
      recipient: 'jane.smith@example.com',
      subject: 'Your Application Status Update',
      status: 'DELIVERED',
      messageId: 'msg_application_002',
      attempts: 1,
      metadata: { type: 'application', status: 'approved' },
    },
    {
      id: `log_${Date.now()}_003`,
      recipient: 'bob.wilson@example.com',
      subject: 'Password Reset Request',
      status: 'FAILED',
      messageId: 'msg_password_003',
      attempts: 3,
      metadata: { type: 'password_reset', reason: 'invalid_email' },
    },
    {
      id: `log_${Date.now()}_004`,
      recipient: 'alice.johnson@example.com',
      subject: 'Monthly Newsletter',
      status: 'DELIVERED',
      messageId: 'msg_newsletter_004',
      attempts: 1,
      metadata: { type: 'newsletter' },
    },
    {
      id: `log_${Date.now()}_005`,
      recipient: 'charlie.brown@example.com',
      subject: 'Event Reminder',
      status: 'PENDING',
      messageId: 'msg_event_005',
      attempts: 0,
      metadata: { type: 'event_reminder' },
    },
  ];

  for (const log of testLogs) {
    try {
      await prisma.emailLog.create({
        data: {
          id: log.id,
          recipient: log.recipient,
          subject: log.subject,
          status: log.status as any,
          messageId: log.messageId,
          attempts: log.attempts,
          metadata: log.metadata,
        }
      });
      console.log(`✅ Created email log: ${log.subject} -> ${log.recipient}`);
    } catch (error) {
      console.error(`❌ Failed to create log for ${log.recipient}:`, error);
    }
  }

  console.log('🎉 Email logs seeded successfully!');
}

async function main() {
  try {
    await seedEmailLogs();
  } catch (error) {
    console.error('💥 Error seeding email logs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
