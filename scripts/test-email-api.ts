import { prisma } from '@/lib/database';

async function testEmailAPI() {
  try {
    console.log('Testing email templates API...');
    
    // Test creating a template
    const template = await prisma.emailTemplate.create({
      data: {
        name: 'Test Welcome Email',
        type: 'WELCOME',
        subject: 'Welcome to IECA Platform',
        htmlContent: '<h1>Welcome {{name}}!</h1><p>Thanks for joining IECA.</p>',
        textContent: 'Welcome {{name}}! Thanks for joining IECA.',
        description: 'Welcome email for new users',
        variables: {
          create: [
            {
              name: 'name',
              description: 'User full name',
              required: true
            },
            {
              name: 'email',
              description: 'User email address',
              required: true
            }
          ]
        }
      },
      include: {
        variables: true
      }
    });

    console.log('✅ Created email template:', template);

    // Test fetching templates
    const templates = await prisma.emailTemplate.findMany({
      include: {
        variables: true,
        _count: {
          select: { emailLogs: true }
        }
      }
    });

    console.log('✅ Fetched templates:', templates.length);

    // Test creating email log
    const log = await prisma.emailLog.create({
      data: {
        templateId: template.id,
        recipient: 'test@example.com',
        subject: 'Welcome to IECA Platform',
        status: 'SENT'
      }
    });

    console.log('✅ Created email log:', log);

    // Test creating email stats
    const stats = await prisma.emailStats.create({
      data: {
        date: new Date(),
        totalSent: 10,
        totalDelivered: 9,
        totalOpened: 5,
        totalClicked: 2,
        totalFailed: 1,
        totalBounced: 0
      }
    });

    console.log('✅ Created email stats:', stats);

    console.log('🎉 All email API tests passed!');

  } catch (error) {
    console.error('❌ Email API test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailAPI();
