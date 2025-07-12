import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyUser() {
  const email = 'yashabalam707@gmail.com';
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (user) {
      console.log('✅ User found in database:');
      console.log('ID:', user.id);
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      console.log('Active:', user.isActive);
      console.log('Created:', user.createdAt);
      console.log('Last Login:', user.lastLoginAt);
      console.log('Profile:', user.profile ? 'Yes' : 'No');
    } else {
      console.log('❌ User not found in database');
    }
  } catch (error) {
    console.error('❌ Error checking user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUser();
