import { prisma } from '@/lib/database';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

// User management functions
export const userService = {
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
    
    return prisma.user.create({
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
    return prisma.application.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
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
    return prisma.application.update({
      where: { id },
      data: {
        status,
        reviewedBy,
        reviewNotes,
        reviewedAt: new Date(),
      },
    });
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
    return prisma.contactForm.create({
      data: {
        ...data,
        type: data.type || 'GENERAL',
        isUrgent: data.isUrgent || false,
      },
    });
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
  // Get dashboard stats
  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      pendingApplications,
      totalResources,
      unreadMessages,
      totalContacts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.resource.count({ where: { status: 'PUBLISHED' } }),
      prisma.chatMessage.count({ where: { isRead: false, role: 'USER' } }),
      prisma.contactForm.count({ where: { status: 'UNREAD' } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      pendingApplications,
      totalResources,
      unreadMessages,
      totalContacts,
    };
  },

  // Get application statistics
  async getApplicationStats() {
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      _count: true,
    });

    return statusCounts.reduce((acc: Record<string, number>, curr: any) => {
      acc[curr.status] = curr._count;
      return acc;
    }, {} as Record<string, number>);
  },

  // Get user growth over time
  async getUserGrowth(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: true,
      orderBy: {
        createdAt: 'asc',
      },
    });
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
