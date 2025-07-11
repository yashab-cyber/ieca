import { prisma } from '../src/lib/database';

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);

    // Test creating a test record (and clean it up)
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'temp_password',
        name: 'Test User',
        profile: {
          create: {},
        },
      },
    });
    console.log('✅ Test user created successfully');

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log('✅ Test user deleted successfully');

    console.log('🎉 All database tests passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
