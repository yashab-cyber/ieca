import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSecurityTools() {
  console.log('🔐 Seeding security tools...');

  const securityTools = [
    {
      name: 'IP Logger',
      type: 'IP_LOGGER',
      description: 'Generate tracking links to log IP addresses and gather visitor information'
    },
    {
      name: 'Port Scanner',
      type: 'PORT_SCANNER',
      description: 'Scan open ports on target systems to identify running services'
    },
    {
      name: 'Vulnerability Scanner',
      type: 'VULNERABILITY_SCANNER',
      description: 'Automated security vulnerability assessment and detection'
    },
    {
      name: 'Hash Cracker',
      type: 'HASH_CRACKER',
      description: 'Decrypt various hash formats using dictionary and brute force attacks'
    },
    {
      name: 'Subdomain Finder',
      type: 'SUBDOMAIN_FINDER',
      description: 'Discover subdomains for target domains using various techniques'
    },
    {
      name: 'DNS Lookup',
      type: 'DNS_LOOKUP',
      description: 'Comprehensive DNS record analysis and enumeration'
    },
    {
      name: 'WHOIS Lookup',
      type: 'WHOIS_LOOKUP',
      description: 'Domain registration and ownership information lookup'
    },
    {
      name: 'SSL Checker',
      type: 'SSL_CHECKER',
      description: 'Analyze SSL/TLS certificates and security configurations'
    },
    {
      name: 'Header Analyzer',
      type: 'HEADER_ANALYZER',
      description: 'Analyze HTTP security headers and server configurations'
    },
    {
      name: 'URL Expander',
      type: 'URL_EXPANDER',
      description: 'Expand shortened URLs and analyze redirect chains safely'
    },
    {
      name: 'Phishing Detector',
      type: 'PHISHING_DETECTOR',
      description: 'Detect and analyze potential phishing websites and campaigns'
    },
    {
      name: 'Malware Scanner',
      type: 'MALWARE_SCANNER',
      description: 'Scan files and URLs for malware and malicious content'
    }
  ];

  for (const tool of securityTools) {
    const existingTool = await prisma.securityTool.findFirst({
      where: { type: tool.type as any }
    });

    if (!existingTool) {
      await prisma.securityTool.create({
        data: {
          ...tool,
          type: tool.type as any,
          isActive: true
        }
      });
      console.log(`✅ Created security tool: ${tool.name}`);
    } else {
      console.log(`⏭️  Security tool already exists: ${tool.name}`);
    }
  }

  console.log('🔐 Security tools seeding completed!');
}

async function seedUsers() {
  console.log('👤 Seeding test users...');

  const testUsers = [
    {
      id: 'user1',
      email: 'admin@ieca.dev',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.dq0FFocmy', // password123
      name: 'Admin User',
      role: 'ADMIN'
    },
    {
      id: 'user2',
      email: 'member@ieca.dev',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.dq0FFocmy', // password123
      name: 'Member User',
      role: 'MEMBER'
    }
  ];

  for (const user of testUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          ...user,
          role: user.role as any
        }
      });
      console.log(`✅ Created user: ${user.email}`);
    } else {
      console.log(`⏭️  User already exists: ${user.email}`);
    }
  }

  console.log('👤 Users seeding completed!');
}

async function seedSampleSecurityData() {
  console.log('📊 Seeding sample security data...');

  // Get the IP Logger tool
  const ipLoggerTool = await prisma.securityTool.findFirst({
    where: { type: 'IP_LOGGER' }
  });

  if (ipLoggerTool) {
    // Create sample IP logger session
    const session = await prisma.securityToolUsage.create({
      data: {
        toolId: ipLoggerTool.id,
        userId: 'user1',
        sessionId: 'demo_session_001',
        inputData: {
          name: 'Demo Campaign',
          description: 'Sample tracking campaign for demonstration',
          redirectUrl: 'https://example.com',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        },
        outputData: {
          trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/track/demo_session_001`,
          sessionId: 'demo_session_001'
        },
        status: 'PROCESSING'
      }
    });

    // Create sample IP log entries
    const sampleIpLogs = [
      {
        usageId: session.id,
        sessionId: 'demo_session_001',
        targetUrl: 'https://example.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        country: 'United States',
        city: 'New York',
        region: 'New York',
        timezone: 'America/New_York',
        isp: 'Verizon Communications',
        device: 'Desktop',
        browser: 'Chrome',
        os: 'Windows 10',
        referer: 'https://twitter.com',
        clickedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        usageId: session.id,
        sessionId: 'demo_session_001',
        targetUrl: 'https://example.com',
        ipAddress: '10.0.0.25',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        country: 'Canada',
        city: 'Toronto',
        region: 'Ontario',
        timezone: 'America/Toronto',
        isp: 'Bell Canada',
        device: 'Mobile',
        browser: 'Safari',
        os: 'iOS 15',
        referer: 'https://facebook.com',
        clickedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        usageId: session.id,
        sessionId: 'demo_session_001',
        targetUrl: 'https://example.com',
        ipAddress: '172.16.0.50',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        country: 'United Kingdom',
        city: 'London',
        region: 'England',
        timezone: 'Europe/London',
        isp: 'British Telecom',
        device: 'Desktop',
        browser: 'Chrome',
        os: 'macOS',
        referer: 'https://linkedin.com',
        clickedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      }
    ];

    for (const logEntry of sampleIpLogs) {
      await prisma.ipLogEntry.create({
        data: logEntry
      });
    }

    console.log(`✅ Created sample IP logger session with ${sampleIpLogs.length} log entries`);
  }

  console.log('📊 Sample security data seeding completed!');
}

async function main() {
  try {
    await seedUsers();
    await seedSecurityTools();
    await seedSampleSecurityData();
    console.log('🎉 All seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
