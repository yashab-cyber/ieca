import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGlobalChat() {
  console.log('🗨️ Seeding global chat...');

  try {
    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('❌ No admin user found. Please run main seed first.');
      return;
    }

    // Create or get global chat room
    let globalRoom = await prisma.globalChatRoom.findFirst({
      where: { name: 'General' }
    });

    if (!globalRoom) {
      globalRoom = await prisma.globalChatRoom.create({
        data: {
          name: 'General',
          description: 'Global chat room for all IECA members',
          createdBy: adminUser.id,
        }
      });
    }

    // Create sample messages
    const welcomeMessage = await prisma.globalChatMessage.create({
      data: {
        roomId: globalRoom.id,
        userId: adminUser.id,
        content: 'Welcome to the IECA Global Chat! 🚀 This is where all members can collaborate, share files, and discuss cybersecurity topics. Feel free to share documents, code snippets, images, and more!',
        messageType: 'TEXT',
      }
    });

    const codeMessage = await prisma.globalChatMessage.create({
      data: {
        roomId: globalRoom.id,
        userId: adminUser.id,
        content: 'Here\'s a useful Python script for network scanning:\n\n```python\nimport nmap\n\nnm = nmap.PortScanner()\nresult = nm.scan("127.0.0.1", "22-443")\nprint(result)\n```',
        messageType: 'CODE',
      }
    });

    // Join admin to the room
    await prisma.globalChatMember.upsert({
      where: {
        roomId_userId: {
          roomId: globalRoom.id,
          userId: adminUser.id,
        }
      },
      update: {
        lastSeenAt: new Date(),
      },
      create: {
        roomId: globalRoom.id,
        userId: adminUser.id,
        role: 'ADMIN',
        lastSeenAt: new Date(),
      }
    });

    console.log('✅ Global chat seeded successfully');
    console.log(`   - Created room: ${globalRoom.name}`);
    console.log(`   - Added ${2} sample messages`);

  } catch (error) {
    console.error('❌ Error seeding global chat:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedGlobalChat()
    .then(() => {
      console.log('🎉 Global chat seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Global chat seed failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { seedGlobalChat };
