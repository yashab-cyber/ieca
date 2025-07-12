const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSecurityTools() {
  try {
    console.log('Adding security tools to database...');

    // Check if tools already exist
    const existingTools = await prisma.securityTool.findMany();
    if (existingTools.length > 0) {
      console.log('Security tools already exist:', existingTools.length);
      return;
    }

    const tools = [
      {
        name: 'IP Logger',
        type: 'IP_LOGGER',
        description: 'Generate tracking links to log IP addresses and gather visitor information',
        isActive: true
      },
      {
        name: 'Port Scanner',
        type: 'PORT_SCANNER',
        description: 'Scan open ports on target systems to identify running services',
        isActive: true
      },
      {
        name: 'Vulnerability Scanner',
        type: 'VULNERABILITY_SCANNER',
        description: 'Automated security vulnerability assessment and detection',
        isActive: true
      },
      {
        name: 'Hash Cracker',
        type: 'HASH_CRACKER',
        description: 'Decrypt various hash formats using dictionary and brute force attacks',
        isActive: true
      },
      {
        name: 'Subdomain Finder',
        type: 'SUBDOMAIN_FINDER',
        description: 'Discover subdomains for target domains using various techniques',
        isActive: true
      },
      {
        name: 'URL Shortener',
        type: 'URL_SHORTENER',
        description: 'Create shortened URLs with tracking and analytics capabilities',
        isActive: true
      }
    ];

    for (const tool of tools) {
      const created = await prisma.securityTool.create({
        data: tool
      });
      console.log('Created tool:', created.name);
    }

    console.log('Security tools added successfully!');
  } catch (error) {
    console.error('Error adding security tools:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSecurityTools();
