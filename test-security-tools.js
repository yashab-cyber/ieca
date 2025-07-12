const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSecurityTools() {
  try {
    console.log('Checking security tools in database...');
    
    const tools = await prisma.securityTool.findMany();
    console.log('Found', tools.length, 'security tools');
    
    if (tools.length > 0) {
      console.log('First tool:', tools[0]);
    }
    
    // Check if we have the user
    const user = await prisma.user.findUnique({
      where: { email: 'yashabalam707@gmail.com' }
    });
    
    if (user) {
      console.log('User found:', user.name);
      
      // Check tool usage
      const usage = await prisma.securityToolUsage.findMany({
        where: { userId: user.id }
      });
      console.log('Tool usage records:', usage.length);
    } else {
      console.log('User not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSecurityTools();
