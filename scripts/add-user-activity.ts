import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addUserActivity() {
  console.log('🎯 Adding activity to existing users...');

  try {
    // Get existing users
    const users = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      include: { profile: true },
    });

    if (users.length === 0) {
      console.log('No users found. Please create users first.');
      return;
    }

    // Get security tools
    const securityTools = await prisma.securityTool.findMany();

    if (securityTools.length === 0) {
      console.log('No security tools found. Creating sample tool...');
      
      await prisma.securityTool.create({
        data: {
          name: 'IP Logger',
          description: 'Track and log IP addresses',
          type: 'IP_LOGGER',
          isActive: true,
        },
      });
      
      await prisma.securityTool.create({
        data: {
          name: 'URL Expander',
          description: 'Expand shortened URLs',
          type: 'URL_EXPANDER',
          isActive: true,
        },
      });
      
      await prisma.securityTool.create({
        data: {
          name: 'Port Scanner',
          description: 'Scan network ports',
          type: 'PORT_SCANNER',
          isActive: true,
        },
      });
    }

    const allTools = await prisma.securityTool.findMany();
    
    // Add activity for each user
    for (const user of users) {
      console.log(`Adding activity for ${user.name}...`);
      
      // Random number of activities
      const toolUsageCount = Math.floor(Math.random() * 10) + 5; // 5-15 tool usages
      const scanCount = Math.floor(Math.random() * 5) + 2; // 2-7 scans
      const reportCount = Math.floor(Math.random() * 3) + 1; // 1-4 reports
      
      // Add tool usage
      for (let i = 0; i < toolUsageCount; i++) {
        const randomTool = allTools[Math.floor(Math.random() * allTools.length)];
        
        await prisma.securityToolUsage.create({
          data: {
            toolId: randomTool.id,
            userId: user.id,
            sessionId: `session_${Date.now()}_${i}`,
            inputData: {
              target: `example${i}.com`,
              type: 'scan',
            },
            outputData: {
              result: 'success',
              data: `Output from ${randomTool.name}`,
            },
            ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
            userAgent: 'Mozilla/5.0 (compatible; SecurityTool/1.0)',
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within last 7 days
            completedAt: new Date(),
          },
        });
      }
      
      // Add security scans
      for (let i = 0; i < scanCount; i++) {
        const scanTypes = ['PORT_SCAN', 'VULNERABILITY_SCAN', 'NETWORK_SCAN'];
        const randomScanType = scanTypes[Math.floor(Math.random() * scanTypes.length)];
        
        await prisma.securityScan.create({
          data: {
            userId: user.id,
            scanType: randomScanType as any,
            target: `192.168.1.${100 + i}`,
            results: {
              ports: [22, 80, 443, 8080],
              vulnerabilities: [`CVE-2024-${1000 + i}`],
              summary: `${randomScanType} completed`,
            },
            status: 'COMPLETED',
            progress: 100,
            startedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            completedAt: new Date(),
          },
        });
      }
      
      // Add vulnerability reports
      for (let i = 0; i < reportCount; i++) {
        const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
        
        await prisma.vulnerabilityReport.create({
          data: {
            userId: user.id,
            title: `Critical Vulnerability Found - ${randomSeverity}`,
            description: `This vulnerability was discovered during security assessment. Severity: ${randomSeverity}`,
            severity: randomSeverity as any,
            target: `https://target${i}.example.com`,
            proof: `Proof of concept documentation`,
            status: 'PENDING',
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          },
        });
      }
      
      // Update user profile with base points
      if (user.profile) {
        await prisma.userProfile.update({
          where: { userId: user.id },
          data: {
            points: Math.floor(Math.random() * 500) + 100, // 100-600 base points
            reputation: Math.floor(Math.random() * 100) + 10, // 10-110 reputation
          },
        });
      }
    }

    console.log('✅ Successfully added activity data for all users!');
    console.log(`📊 Enhanced leaderboard data for ${users.length} users`);
    
  } catch (error) {
    console.error('❌ Error adding user activity:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
addUserActivity()
  .catch((error) => {
    console.error('❌ Failed to add user activity:', error);
    process.exit(1);
  });
