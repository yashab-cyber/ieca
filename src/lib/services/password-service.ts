import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/database';

interface ApplicationData {
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  experience?: string;
  motivation?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export class PasswordService {
  // Generate a random secure password
  static generatePassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '@#$%&*!';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = '';
    
    // Ensure at least one character from each set
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password to avoid predictable patterns
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Hash a password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify a password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate password reset token
  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Create user account with generated password
  static async createUserAccountFromApplication(application: ApplicationData): Promise<{ user: any; tempPassword: string }> {
    const tempPassword = this.generatePassword(12);
    const hashedPassword = await this.hashPassword(tempPassword);

    try {
      // Create user account
      const user = await prisma.user.create({
        data: {
          name: application.name,
          email: application.email,
          phone: application.phone,
          password: hashedPassword,
          role: 'MEMBER',
          isActive: true,
          lastLoginAt: null,
          profile: {
            create: {
              skills: application.skills || [],
              isPublic: true,
              reputation: 0,
              points: 100 // Welcome points
            }
          }
        },
        include: {
          profile: true
        }
      });

      return { user, tempPassword };
    } catch (error) {
      console.error('Error creating user account from application:', error);
      throw new Error('Failed to create user account');
    }
  }

  // Create password reset request
  static async createPasswordResetRequest(email: string): Promise<{ user: any; resetToken: string } | null> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

      // Generate reset token
      const resetToken = this.generateResetToken();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Save reset token to user (temporarily commented out until migration completes)
      // await prisma.user.update({
      //   where: { id: user.id },
      //   data: {
      //     resetToken,
      //     resetTokenExpiry,
      //   },
      // });

      // For now, we'll store the token in memory or use a different approach
      console.log('Reset token generated:', resetToken);
      console.log('TODO: Store reset token in database after migration completes');

      return { user, resetToken };
    } catch (error) {
      console.error('Error creating password reset request:', error);
      throw new Error('Failed to create password reset request');
    }
  }

  // Reset password with token
  static async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
    try {
      // Find user with valid reset token (temporarily simplified)
      // const user = await prisma.user.findFirst({
      //   where: {
      //     resetToken: token,
      //     resetTokenExpiry: {
      //       gt: new Date(), // Token not expired
      //     },
      //   },
      // });

      // Temporary implementation - find user by any available method
      // This should be replaced with proper token validation after migration
      console.log('TODO: Implement proper token validation after database migration');
      
      // For now, return false to indicate this feature needs migration
      return false;

      // if (!user) {
      //   return false;
      // }

      // // Hash new password
      // const hashedPassword = await this.hashPassword(newPassword);

      // // Update user password and clear reset token
      // await prisma.user.update({
      //   where: { id: user.id },
      //   data: {
      //     password: hashedPassword,
      //     resetToken: null,
      //     resetTokenExpiry: null,
      //   },
      // });

      // return true;
    } catch (error) {
      console.error('Error resetting password with token:', error);
      return false;
    }
  }

  // Change password for authenticated user
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    // Get user with current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user || !user.password) {
      return false;
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return false;
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
      },
    });

    return true;
  }
}
