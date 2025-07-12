import { prisma } from '@/lib/database';
import { emailService } from '@/lib/email';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

// User management functions
export const userService = {
  // Get user statistics
  async getUserStats(userId: string) {
    try {
      // Get user with profile
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Count security tool usage
      const toolUsageCount = await prisma.securityToolUsage.count({
        where: { userId },
      });

      // Count completed security scans
      const completedScansCount = await prisma.securityScan.count({
        where: { userId, status: 'COMPLETED' },
      });

      // Count vulnerability reports
      const vulnerabilityReportsCount = await prisma.vulnerabilityReport.count({
        where: { userId },
      });

      // Count hash crack sessions
      const hashCrackSessionsCount = await prisma.hashCrackSession.count({
        where: { userId },
      });

      // Count global chat messages
      const chatMessagesCount = await prisma.globalChatMessage.count({
        where: { userId },
      });

      // Calculate total activities/missions
      const totalMissions = toolUsageCount + completedScansCount + vulnerabilityReportsCount + hashCrackSessionsCount;

      // Get user's rank based on points
      const usersWithHigherPoints = await prisma.userProfile.count({
        where: { 
          points: { gt: user.profile?.points || 0 },
          isPublic: true 
        },
      });
      const userRank = usersWithHigherPoints + 1;

      // Calculate badges earned (based on achievements)
      const badges = [];
      
      // Top Contributor badge (top 10% of users by points)
      const totalPublicUsers = await prisma.userProfile.count({
        where: { isPublic: true },
      });
      if (userRank <= Math.ceil(totalPublicUsers * 0.1)) {
        badges.push({
          id: 'top-contributor',
          title: 'Top Contributor',
          description: 'Awarded for being in the top 10% of contributors.',
          icon: 'Award'
        });
      }

      // Mission Specialist badge (5+ completed activities)
      if (totalMissions >= 5) {
        badges.push({
          id: 'mission-specialist',
          title: 'Mission Specialist',
          description: 'Successfully completed 5+ security missions.',
          icon: 'Target'
        });
      }

      // Community Defender badge (3+ vulnerability reports)
      if (vulnerabilityReportsCount >= 3) {
        badges.push({
          id: 'community-defender',
          title: 'Community Defender',
          description: 'Reported 3+ security vulnerabilities.',
          icon: 'ShieldCheck'
        });
      }

      // Rapid Responder badge (10+ chat messages)
      if (chatMessagesCount >= 10) {
        badges.push({
          id: 'rapid-responder',
          title: 'Rapid Responder',
          description: 'Active community member with 10+ chat messages.',
          icon: 'Zap'
        });
      }

      return {
        rank: userRank,
        points: user.profile?.points || 0,
        missions: totalMissions,
        badges: badges.length,
        badgeDetails: badges,
        toolUsage: toolUsageCount,
        scansCompleted: completedScansCount,
        vulnerabilityReports: vulnerabilityReportsCount,
        chatMessages: chatMessagesCount,
        reputation: user.profile?.reputation || 0,
        joinedAt: user.profile?.joinedAt || user.createdAt,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  },

  // Create a new user
  async createUser(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        profile: {
          create: {
            isPublic: false,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail user creation if email fails
    }

    return user;
  },

  // Authenticate user
  async authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return null;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return user;
  },

  // Get user by ID
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  },

  // Get user by email
  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  },

  // Update user profile
  async updateUserProfile(userId: string, data: any) {
    return prisma.userProfile.update({
      where: { userId },
      data,
    });
  },

  // Update complete user profile (both User and UserProfile tables)
  async updateCompleteUserProfile(userId: string, data: {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    bio?: string;
    skills?: string[];
    experience?: string;
    location?: string;
    website?: string;
    avatar?: string;
    isPublic?: boolean;
  }) {
    // Separate user fields from profile fields
    const userFields = {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.linkedin && { linkedin: data.linkedin }),
      ...(data.github && { github: data.github }),
    };

    const profileFields = {
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.skills && { skills: data.skills }),
      ...(data.experience && { experience: data.experience }),
      ...(data.location && { location: data.location }),
      ...(data.website && { website: data.website }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
    };

    // Use transaction to update both tables
    return prisma.$transaction(async (tx) => {
      // Update user table if there are user fields
      if (Object.keys(userFields).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userFields,
        });
      }

      // Update or create profile if there are profile fields
      if (Object.keys(profileFields).length > 0) {
        await tx.userProfile.upsert({
          where: { userId },
          update: profileFields,
          create: {
            userId,
            ...profileFields,
          },
        });
      }

      // Return the updated user with profile
      return tx.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });
    });
  },

  // Get all users (admin function)
  async getAllUsers() {
    return prisma.user.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Get all members for directory
  async getMembers() {
    return prisma.user.findMany({
      where: {
        isActive: true,
        role: { in: ['MEMBER', 'MODERATOR', 'ADMIN'] },
      },
      include: {
        profile: {
          where: { isPublic: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

// Application management functions
export const applicationService = {
  // Submit new application
  async submitApplication(data: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    skills: string[];
    statement: string;
    isIndianCitizen: boolean;
    userId?: string;
  }) {
    const application = await prisma.application.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });

    // Send application confirmation email
    try {
      await emailService.sendApplicationConfirmation(
        application.email, 
        application.name, 
        application.id
      );
    } catch (error) {
      console.error('Failed to send application confirmation email:', error);
      // Don't fail application submission if email fails
    }

    return application;
  },

  // Get all applications (admin)
  async getAllApplications() {
    return prisma.application.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Update application status
  async updateApplicationStatus(
    id: string,
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED',
    reviewedBy: string,
    reviewNotes?: string
  ) {
    const application = await prisma.application.update({
      where: { id },
      data: {
        status,
        reviewedBy,
        reviewNotes,
        reviewedAt: new Date(),
      },
    });

    // Send status update email for approved/rejected applications
    if (status === 'APPROVED' || status === 'REJECTED') {
      try {
        await emailService.sendApplicationStatusUpdate(
          application.email,
          application.name,
          status.toLowerCase() as 'approved' | 'rejected',
          reviewNotes
        );
      } catch (error) {
        console.error('Failed to send application status email:', error);
        // Don't fail status update if email fails
      }
    }

    return application;
  },

  // Get application by ID
  async getApplicationById(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  },
};

// Chat service functions
export const chatService = {
  // Save chat message
  async saveChatMessage(data: {
    userId?: string;
    message: string;
    response?: string;
    role: 'USER' | 'MODEL' | 'SYSTEM';
    metadata?: any;
  }) {
    return prisma.chatMessage.create({
      data,
    });
  },

  // Get chat history for user
  async getChatHistory(userId?: string, limit = 50) {
    return prisma.chatMessage.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // Get unread messages (admin)
  async getUnreadMessages() {
    return prisma.chatMessage.findMany({
      where: { isRead: false, role: 'USER' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Mark message as read
  async markMessageAsRead(id: string) {
    return prisma.chatMessage.update({
      where: { id },
      data: { isRead: true },
    });
  },
};

// Contact form service
export const contactService = {
  // Submit contact form
  async submitContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    type?: 'GENERAL' | 'THREAT_REPORT' | 'SUPPORT' | 'PARTNERSHIP' | 'MEDIA';
    isUrgent?: boolean;
  }) {
    const contactForm = await prisma.contactForm.create({
      data: {
        ...data,
        type: data.type || 'GENERAL',
        isUrgent: data.isUrgent || false,
      },
    });

    // Send contact form notification to admins
    try {
      await emailService.sendContactFormNotification(
        contactForm.name,
        contactForm.email,
        contactForm.subject,
        contactForm.message
      );
    } catch (error) {
      console.error('Failed to send contact form notification:', error);
      // Don't fail contact form submission if email fails
    }

    return contactForm;
  },

  // Get all contact forms (admin)
  async getAllContactForms() {
    return prisma.contactForm.findMany({
      orderBy: [
        { isUrgent: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  },

  // Update contact form status
  async updateContactFormStatus(id: string, status: 'UNREAD' | 'READ' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED') {
    return prisma.contactForm.update({
      where: { id },
      data: { status },
    });
  },
};

// Resource service
export const resourceService = {
  // Create new resource
  async createResource(data: {
    title: string;
    description?: string;
    content?: string;
    fileUrl?: string;
    category: string;
    tags: string[];
    authorName: string;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  }) {
    return prisma.resource.create({
      data: {
        ...data,
        difficulty: data.difficulty || 'BEGINNER',
      },
    });
  },

  // Get all resources
  async getAllResources() {
    return prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  // Get all published resources
  async getPublishedResources() {
    return prisma.resource.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Get resources by filters
  async getResourcesByFilters(filters: {
    category?: string | null;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null;
  }) {
    const where: any = { status: 'PUBLISHED' };
    
    if (filters.category) {
      where.category = filters.category;
    }
    
    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }

    return prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  // Get resource by ID and increment views
  async getResourceById(id: string) {
    const resource = await prisma.resource.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    return resource;
  },

  // Increment download count
  async incrementDownloads(id: string) {
    return prisma.resource.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
  },

  // Update resource
  async updateResource(id: string, data: any) {
    return prisma.resource.update({
      where: { id },
      data,
    });
  },

  // Delete resource
  async deleteResource(id: string) {
    return prisma.resource.delete({
      where: { id },
    });
  },
};

// Activity logging
export const activityService = {
  // Log user activity
  async logActivity(data: {
    userId: string;
    action: 'LOGIN' | 'LOGOUT' | 'PROFILE_UPDATE' | 'APPLICATION_SUBMIT' | 'CHAT_MESSAGE' | 'RESOURCE_DOWNLOAD' | 'BLOG_POST_CREATE' | 'COMMENT_CREATE';
    description: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.activity.create({
      data,
    });
  },

  // Get recent activities
  async getRecentActivities(limit = 100) {
    return prisma.activity.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // Get user activities
  async getUserActivities(userId: string, limit = 50) {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
};

// Analytics and statistics
export const analyticsService = {
  // Get comprehensive dashboard stats
  async getDashboardStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalApplications,
      pendingApplications,
      approvedApplications,
      totalChatMessages,
      // totalGlobalChatMessages, // Comment out for now
      totalResources,
      totalBlogPosts,
      totalContacts,
      unreadContacts,
      recentActivities,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.count({ where: { status: 'APPROVED' } }),
      prisma.chatMessage.count(),
      // prisma.globalChatMessage.count(), // Comment out for now
      prisma.resource.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.contactForm.count(),
      prisma.contactForm.count({ where: { status: 'UNREAD' } }),
      prisma.activity.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

    const approvalRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalApplications,
      pendingApplications,
      approvedApplications,
      approvalRate,
      totalChatMessages: totalChatMessages + 0, // Use regular chat messages only for now
      totalResources,
      totalBlogPosts,
      totalContacts,
      unreadContacts,
      recentActivities,
    };
  },

  // Get application statistics with detailed breakdown
  async getApplicationStats() {
    const [statusCounts, monthlyApplications, skillsData] = await Promise.all([
      prisma.application.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.getMonthlyApplications(),
      this.getPopularSkills(),
    ]);

    const statusBreakdown = statusCounts.reduce((acc: Record<string, number>, curr: any) => {
      acc[curr.status] = curr._count;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(statusBreakdown).reduce((sum, count) => sum + count, 0);
    const approvalRate = total > 0 ? ((statusBreakdown.APPROVED || 0) / total) * 100 : 0;

    return {
      statusBreakdown,
      approvalRate,
      monthlyApplications,
      popularSkills: skillsData,
      total,
    };
  },

  // Get monthly application trends
  async getMonthlyApplications() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const applications = await prisma.application.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: 'asc' },
    });

    const monthlyData: Record<string, { total: number; approved: number; pending: number; rejected: number }> = {};

    applications.forEach(app => {
      const monthKey = app.createdAt.toISOString().slice(0, 7); // YYYY-MM format
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, approved: 0, pending: 0, rejected: 0 };
      }
      monthlyData[monthKey].total++;
      if (app.status === 'APPROVED') monthlyData[monthKey].approved++;
      else if (app.status === 'PENDING') monthlyData[monthKey].pending++;
      else if (app.status === 'REJECTED') monthlyData[monthKey].rejected++;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));
  },

  // Get popular skills from applications
  async getPopularSkills() {
    const applications = await prisma.application.findMany({
      select: { skills: true },
    });

    const skillCounts: Record<string, number> = {};
    applications.forEach(app => {
      app.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  },

  // Get user growth over time with detailed breakdown
  async getUserGrowth(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, role: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyData: Record<string, { date: string; total: number; members: number; admins: number }> = {};

    users.forEach(user => {
      const dateKey = user.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD format
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, total: 0, members: 0, admins: 0 };
      }
      dailyData[dateKey].total++;
      if (user.role === 'MEMBER') dailyData[dateKey].members++;
      else if (user.role === 'ADMIN') dailyData[dateKey].admins++;
    });

    return Object.values(dailyData);
  },

  // Get chat analytics
  async getChatAnalytics() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Use regular chat messages for now
    const [
      totalMessages,
      messagesThisWeek,
      topUsers,
    ] = await Promise.all([
      prisma.chatMessage.count(),
      prisma.chatMessage.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.getTopChatUsers(),
    ]);

    const messagesByType = await this.getMessagesByType();
    const attachmentStats = await this.getAttachmentStats();

    return {
      totalMessages,
      messagesThisWeek,
      activeRooms: 1, // Placeholder
      topUsers,
      messagesByType,
      attachmentStats,
    };
  },

  // Get top chat users by message count
  async getTopChatUsers() {
    const topUsers = await prisma.chatMessage.groupBy({
      by: ['userId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
      where: { userId: { not: null } },
    });

    const userIds = topUsers.map((u: any) => u.userId).filter(Boolean);
    
    const userDetails = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    return topUsers.map((user: any) => {
      const details = userDetails.find(u => u.id === user.userId);
      return {
        userId: user.userId,
        name: details?.name || 'Unknown',
        messageCount: user._count.id,
      };
    });
  },

  // Get messages by type breakdown
  async getMessagesByType() {
    // Use regular chat messages for now
    const total = await prisma.chatMessage.count();
    return [
      { messageType: 'TEXT', _count: { id: total } },
    ];
  },

  // Get attachment statistics
  async getAttachmentStats() {
    // Placeholder for now
    return {
      totalAttachments: 0,
      fileTypes: [],
      totalSizeBytes: 0,
    };
  },

  // Get security analytics
  async getSecurityAnalytics() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      failedLogins,
      recentActivities,
      suspiciousActivities,
      threatReports,
    ] = await Promise.all([
      prisma.activity.count({
        where: {
          action: 'LOGIN',
          createdAt: { gte: sevenDaysAgo },
          description: { contains: 'failed' },
        },
      }),
      prisma.activity.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.activity.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
          description: { contains: 'suspicious' },
        },
      }),
      prisma.contactForm.count({
        where: { type: 'THREAT_REPORT' },
      }),
    ]);

    return {
      failedLogins,
      recentActivities,
      suspiciousActivities,
      threatReports,
    };
  },

  // Get resource analytics
  async getResourceAnalytics() {
    const [
      totalDownloads,
      popularResources,
      resourcesByCategory,
      averageRating,
    ] = await Promise.all([
      prisma.resource.aggregate({ _sum: { downloads: true } }),
      prisma.resource.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { downloads: 'desc' },
        take: 10,
        select: { title: true, downloads: true, views: true, rating: true },
      }),
      prisma.resource.groupBy({
        by: ['category'],
        _count: { id: true },
        where: { status: 'PUBLISHED' },
      }),
      prisma.resource.aggregate({
        _avg: { rating: true },
        where: { status: 'PUBLISHED' },
      }),
    ]);

    return {
      totalDownloads: totalDownloads._sum.downloads || 0,
      popularResources,
      resourcesByCategory,
      averageRating: averageRating._avg.rating || 0,
    };
  },
};

// Blog service functions
export const blogService = {
  async getAllPosts() {
    return prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getPostById(id: string) {
    return prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  },

  async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
    authorId: string;
  }) {
    // Generate slug from title
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    return prisma.blogPost.create({
      data: {
        ...data,
        slug,
        tags: data.tags || [],
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async updatePost(id: string, data: any) {
    return prisma.blogPost.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async deletePost(id: string) {
    return prisma.blogPost.delete({
      where: { id },
    });
  },
};

// Comment service functions
export const commentService = {
  async createComment(data: {
    content: string;
    userId: string;
    postId: string;
  }) {
    return prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  },

  async getCommentsByPost(postId: string) {
    return prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateComment(id: string, content: string) {
    return prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  },

  async deleteComment(id: string) {
    return prisma.comment.delete({
      where: { id },
    });
  },
};

// Notification service functions
export const notificationService = {
  async createNotification(data: {
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    isGlobal?: boolean;
  }) {
    return prisma.notification.create({
      data: {
        ...data,
        isGlobal: data.isGlobal || false,
      },
    });
  },

  async getGlobalNotifications() {
    return prisma.notification.findMany({
      where: { isGlobal: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getAllNotifications() {
    return prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  async deleteNotification(id: string) {
    return prisma.notification.delete({
      where: { id },
    });
  },
};

// Event service functions (using activities for events)
export const eventService = {
  async getAllEvents() {
    return prisma.activity.findMany({
      where: { action: 'BLOG_POST_CREATE' }, // Using an existing enum value
      orderBy: { createdAt: 'desc' },
    });
  },

  async getEventById(id: string) {
    return prisma.activity.findUnique({
      where: { id },
    });
  },

  async createEvent(data: {
    description: string;
    userId: string;
    metadata?: any;
  }) {
    return prisma.activity.create({
      data: {
        ...data,
        action: 'BLOG_POST_CREATE', // Using an existing enum value
      },
    });
  },
};

// Full Global Chat Service
export const globalChatService = {
  // Get or create the default global chat room
  async getGlobalRoom() {
    let room = await prisma.globalChatRoom.findFirst({
      where: { name: 'General' },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { members: true, messages: true }
        }
      }
    });

    if (!room) {
      // Create default room if it doesn't exist
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });

      if (adminUser) {
        room = await prisma.globalChatRoom.create({
          data: {
            name: 'General',
            description: 'Global chat room for all IECA members',
            createdBy: adminUser.id,
          },
          include: {
            creator: {
              select: { id: true, name: true, email: true }
            },
            _count: {
              select: { members: true, messages: true }
            }
          }
        });
      }
    }

    return room;
  },

  // Join user to global chat room
  async joinRoom(roomId: string, userId: string) {
    return prisma.globalChatMember.upsert({
      where: {
        roomId_userId: {
          roomId,
          userId
        }
      },
      update: {
        lastSeenAt: new Date(),
      },
      create: {
        roomId,
        userId,
        role: 'MEMBER',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  },

  // Send a message
  async sendMessage(data: {
    roomId: string;
    userId: string;
    content?: string;
    messageType?: 'TEXT' | 'FILE' | 'IMAGE' | 'CODE' | 'DOCUMENT';
    replyToId?: string;
  }) {
    return prisma.globalChatMessage.create({
      data: {
        roomId: data.roomId,
        userId: data.userId,
        content: data.content,
        messageType: data.messageType || 'TEXT',
        replyToId: data.replyToId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, profile: { select: { avatar: true } } }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            user: { select: { name: true } }
          }
        },
        attachments: true,
        reactions: {
          include: {
            user: { select: { name: true } }
          }
        },
        _count: {
          select: { reactions: true, replies: true }
        }
      }
    });
  },

  // Get messages for a room
  async getMessages(roomId: string, limit: number = 50, offset: number = 0) {
    return prisma.globalChatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: { id: true, name: true, email: true, profile: { select: { avatar: true } } }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            user: { select: { name: true } }
          }
        },
        attachments: true,
        reactions: {
          include: {
            user: { select: { name: true } }
          }
        },
        _count: {
          select: { reactions: true, replies: true }
        }
      }
    });
  },

  // Add attachment to message
  async addAttachment(data: {
    messageId: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    downloadUrl: string;
  }) {
    return prisma.globalChatAttachment.create({
      data
    });
  },

  // Add reaction to message
  async addReaction(messageId: string, userId: string, emoji: string) {
    return prisma.globalChatReaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji
        }
      },
      update: {},
      create: {
        messageId,
        userId,
        emoji
      }
    });
  },

  // Remove reaction from message
  async removeReaction(messageId: string, userId: string, emoji: string) {
    return prisma.globalChatReaction.delete({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji
        }
      }
    });
  },

  // Get online members
  async getOnlineMembers(roomId: string) {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return prisma.globalChatMember.findMany({
      where: {
        roomId,
        lastSeenAt: {
          gte: fiveMinutesAgo
        }
      },
      include: {
        user: {
          select: { id: true, name: true, profile: { select: { avatar: true } } }
        }
      }
    });
  },

  // Update last seen
  async updateLastSeen(roomId: string, userId: string) {
    return prisma.globalChatMember.update({
      where: {
        roomId_userId: {
          roomId,
          userId
        }
      },
      data: {
        lastSeenAt: new Date()
      }
    });
  },

  // Get a single message by ID
  async getMessage(messageId: string) {
    return prisma.globalChatMessage.findUnique({
      where: { id: messageId },
      include: {
        user: {
          select: { id: true, name: true, email: true, profile: true }
        },
        room: {
          select: { id: true, name: true }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            user: { select: { name: true } }
          }
        },
        attachments: true,
        reactions: {
          include: {
            user: { select: { name: true } }
          }
        },
        _count: {
          select: { reactions: true, replies: true }
        }
      }
    });
  },

  // Update a message
  async updateMessage(messageId: string, data: { content?: string; isEdited?: boolean }) {
    return prisma.globalChatMessage.update({
      where: { id: messageId },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, profile: true }
        },
        room: {
          select: { id: true, name: true }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            user: { select: { name: true } }
          }
        },
        attachments: true,
        reactions: {
          include: {
            user: { select: { name: true } }
          }
        },
        _count: {
          select: { reactions: true, replies: true }
        }
      }
    });
  },

  // Delete a message and its related data
  async deleteMessage(messageId: string) {
    // Delete in the correct order due to foreign key constraints
    await prisma.$transaction(async (tx) => {
      // Delete reactions first
      await tx.globalChatReaction.deleteMany({
        where: { messageId }
      });

      // Delete attachments
      await tx.globalChatAttachment.deleteMany({
        where: { messageId }
      });

      // Delete replies to this message
      await tx.globalChatMessage.deleteMany({
        where: { replyToId: messageId }
      });

      // Finally delete the message itself
      await tx.globalChatMessage.delete({
        where: { id: messageId }
      });
    });
  }
};
