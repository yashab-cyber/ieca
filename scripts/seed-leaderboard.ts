import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLeaderboardData() {
  console.log('🌱 Seeding leaderboard data...');

  try {
    // Get all users
    const users = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      include: { profile: true },
    });

    if (users.length === 0) {
      console.log('No users found. Creating sample users...');
      
      // Create sample users with profiles
      const sampleUsers = [
        {
          email: 'alice@example.com',
          password: 'hashed_password',
          name: 'Alice Johnson',
          role: 'MEMBER' as const,
        },
        {
          email: 'bob@example.com', 
          password: 'hashed_password',
          name: 'Bob Smith',
          role: 'MEMBER' as const,
        },
        {
          email: 'charlie@example.com',
          password: 'hashed_password', 
          name: 'Charlie Brown',
          role: 'MEMBER' as const,
        },
        {
          email: 'diana@example.com',
          password: 'hashed_password',
          name: 'Diana Prince',
          role: 'MEMBER' as const,
        },
        {
          email: 'eve@example.com',
          password: 'hashed_password',
          name: 'Eve Adams',
          role: 'MEMBER' as const,
        },
      ];

      for (const userData of sampleUsers) {
        const user = await prisma.user.create({
          data: userData,
        });

        // Create profile for each user
        await prisma.userProfile.create({
          data: {
            userId: user.id,
            bio: `Cybersecurity enthusiast and ${userData.name.split(' ')[0]} researcher`,
            skills: ['Penetration Testing', 'Vulnerability Assessment', 'Security Auditing'],
            experience: 'Intermediate',
            location: 'Remote',
            isPublic: true,
            reputation: Math.floor(Math.random() * 100),
            points: Math.floor(Math.random() * 500),
            rank: 'Member',
          },
        });
      }
      
      console.log('✅ Created sample users with profiles');
    }

    // Get updated users list
    const updatedUsers = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      include: { profile: true },
    });

    // Get security tools
    const securityTools = await prisma.securityTool.findMany();

    // Create sample security tool usage
    for (const user of updatedUsers) {
      const usageCount = Math.floor(Math.random() * 15) + 1; // 1-15 usages per user
      
      for (let i = 0; i < usageCount; i++) {
        const randomTool = securityTools[Math.floor(Math.random() * securityTools.length)];
        
        await prisma.securityToolUsage.create({
          data: {
            toolId: randomTool.id,
            userId: user.id,
            sessionId: `session_${user.id}_${i}`,
            inputData: {
              url: `https://example${i}.com`,
              target: `192.168.1.${100 + i}`,
            },
            outputData: {
              result: 'success',
              data: `Sample output for ${randomTool.name}`,
            },
            ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            completedAt: new Date(),
          },
        });
      }
    }

    // Create sample security scans
    for (const user of updatedUsers) {
      const scanCount = Math.floor(Math.random() * 8) + 1; // 1-8 scans per user
      
      for (let i = 0; i < scanCount; i++) {
        const scanTypes = ['PORT_SCAN', 'VULNERABILITY_SCAN', 'NETWORK_SCAN'];
        const randomScanType = scanTypes[Math.floor(Math.random() * scanTypes.length)];
        
        await prisma.securityScan.create({
          data: {
            userId: user.id,
            scanType: randomScanType as any,
            target: `192.168.1.${100 + i}`,
            results: {
              ports: [22, 80, 443],
              vulnerabilities: [`CVE-2023-${1000 + i}`],
              summary: `${randomScanType} completed successfully`,
            },
            status: 'COMPLETED',
            progress: 100,
            startedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            completedAt: new Date(),
          },
        });
      }
    }

    // Create sample vulnerability reports
    for (const user of updatedUsers) {
      const reportCount = Math.floor(Math.random() * 5) + 1; // 1-5 reports per user
      
      for (let i = 0; i < reportCount; i++) {
        const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
        
        await prisma.vulnerabilityReport.create({
          data: {
            userId: user.id,
            title: `Security Vulnerability #${i + 1}`,
            description: `Detailed description of vulnerability found in target system. This vulnerability allows for potential exploitation.`,
            severity: randomSeverity as any,
            target: `https://target${i}.example.com`,
            proof: `Proof of concept for vulnerability #${i + 1}`,
            status: 'PENDING',
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    // Create sample blog posts
    for (const user of updatedUsers) {
      const postCount = Math.floor(Math.random() * 4) + 1; // 1-4 posts per user
      
      for (let i = 0; i < postCount; i++) {
        await prisma.blogPost.create({
          data: {
            title: `Cybersecurity Insights #${i + 1}`,
            content: `This is a detailed blog post about cybersecurity topics and best practices. Written by ${user.name}.`,
            excerpt: `Brief excerpt of the blog post content...`,
            authorId: user.id,
            slug: `cybersecurity-insights-${i + 1}-${user.id}`,
            status: 'PUBLISHED',
            tags: ['cybersecurity', 'hacking', 'security'],
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    // Create sample chat messages
    for (const user of updatedUsers) {
      const messageCount = Math.floor(Math.random() * 50) + 10; // 10-60 messages per user
      
      for (let i = 0; i < messageCount; i++) {
        await prisma.chatMessage.create({
          data: {
            userId: user.id,
            message: `This is a sample chat message #${i + 1} from ${user.name}`,
            role: 'USER',
            isRead: true,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    console.log('✅ Successfully seeded leaderboard data!');
    console.log(`📊 Created activity data for ${updatedUsers.length} users`);
    
  } catch (error) {
    console.error('❌ Error seeding leaderboard data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedLeaderboardData()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
