import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testGlobalChat() {
  console.log('🗨️ Testing global chat functionality...');

  try {
    // Test room query
    const rooms = await prisma.globalChatRoom.findMany();
    console.log(`✅ Found ${rooms.length} chat room(s)`);

    // Test messages query
    const messages = await prisma.globalChatMessage.findMany({
      include: {
        user: true,
        room: true,
      }
    });
    console.log(`✅ Found ${messages.length} message(s)`);

    // Test members query
    const members = await prisma.globalChatMember.findMany({
      include: {
        user: true,
        room: true,
      }
    });
    console.log(`✅ Found ${members.length} member(s)`);

    if (rooms.length > 0) {
      console.log(`📋 Room details: ${rooms[0].name} - ${rooms[0].description}`);
    }

    if (messages.length > 0) {
      console.log(`💬 Sample message: "${messages[0].content.substring(0, 50)}..."`);
    }

    console.log('🎉 Global chat system is working correctly!');

  } catch (error) {
    console.error('❌ Error testing global chat:', error);
    throw error;
  }
}

// Run the test
testGlobalChat()
  .then(() => {
    console.log('✅ Global chat test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Global chat test failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
