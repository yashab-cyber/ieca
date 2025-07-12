import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkAndCreateUser() {
  const email = 'yashabalam707@gmail.com';
  const password = '@Ethicalhacker07';
  const name = 'Yashab Alam';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('✅ User already exists:', {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        isActive: existingUser.isActive,
        createdAt: existingUser.createdAt
      });

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      console.log('🔐 Password verification:', isPasswordValid ? '✅ Valid' : '❌ Invalid');

      if (!isPasswordValid) {
        console.log('🔄 Updating password...');
        const hashedPassword = await bcrypt.hash(password, 12);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: hashedPassword }
        });
        console.log('✅ Password updated successfully');
      }

      return;
    }

    // Create new user if doesn't exist
    console.log('👤 Creating new user...');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN', // Set as admin
        isActive: true,
        profile: {
          create: {
            isPublic: true,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log('✅ User created successfully:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isActive: newUser.isActive
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateUser();
