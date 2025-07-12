import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding security tools data...');

  try {
    // Create some sample shortened URLs
    console.log('Creating shortened URLs...');
    const shortenedUrls = await Promise.all([
      prisma.shortenedUrl.upsert({
        where: { shortCode: 'owasp10' },
        update: {},
        create: {
          originalUrl: 'https://github.com/OWASP/owasp-top-ten',
          shortCode: 'owasp10',
          customAlias: 'owasp10',
          description: 'OWASP Top 10 Security Risks',
          userId: 'user1',
          clicks: 42,
          isActive: true
        }
      }),
      prisma.shortenedUrl.upsert({
        where: { shortCode: 'cvemitre' },
        update: {},
        create: {
          originalUrl: 'https://cve.mitre.org/',
          shortCode: 'cvemitre',
          description: 'CVE Database',
          userId: 'user1',
          clicks: 18,
          isActive: true
        }
      }),
      prisma.shortenedUrl.upsert({
        where: { shortCode: 'exploitdb' },
        update: {},
        create: {
          originalUrl: 'https://www.exploit-db.com/',
          shortCode: 'exploitdb',
          description: 'Exploit Database',
          userId: 'user2',
          clicks: 31,
          isActive: true,
          password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' // 'password'
        }
      })
    ]);

    console.log('✅ Security tools seeding completed!');
    console.log(`Created:`);
    console.log(`- ${shortenedUrls.length} shortened URLs`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
