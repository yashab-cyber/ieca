import { prisma } from '@/lib/database';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Test if we can query users table (existing)
    const userCount = await prisma.user.count();
    console.log(`✅ Users table accessible, count: ${userCount}`);

    // Check available tables through raw query
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log('📋 Available tables:');
    console.log(tables);

    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase();
