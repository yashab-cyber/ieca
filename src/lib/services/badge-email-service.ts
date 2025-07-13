import nodemailer from 'nodemailer';
import { prisma } from '@/lib/database';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'security' | 'scanner' | 'researcher' | 'content' | 'community' | 'streak' | 'welcome';
  earnedAt: string;
}

interface EmailBadgeNotificationProps {
  userId: string;
  userEmail: string;
  userName: string;
  badge: Badge;
  totalBadges: number;
  nextBadgeHint?: string;
}

export class BadgeEmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
    },
  });

  private static getBadgeType(badgeId: string): 'security' | 'scanner' | 'researcher' | 'content' | 'community' | 'streak' | 'welcome' {
    if (badgeId.includes('security')) return 'security';
    if (badgeId.includes('scanner')) return 'scanner';
    if (badgeId.includes('researcher') || badgeId.includes('hunter')) return 'researcher';
    if (badgeId.includes('content') || badgeId.includes('blogger')) return 'content';
    if (badgeId.includes('community')) return 'community';
    if (badgeId.includes('warrior') || badgeId.includes('champion')) return 'streak';
    if (badgeId.includes('welcome') || badgeId.includes('aboard')) return 'welcome';
    return 'security';
  }

  private static getNextBadgeHint(badgeId: string): string | undefined {
    const hints = {
      'security-enthusiast': 'Use 30 more security tools to earn Security Expert badge!',
      'scanner': 'Complete 15 more scans to earn Master Scanner badge!',
      'bug-hunter': 'Submit 5 more reports to earn Security Researcher badge!',
      'blogger': 'Publish 7 more posts to earn Content Creator badge!',
      'weekly-warrior': 'Login for 23 more consecutive days to earn Monthly Champion!',
      'monthly-champion': 'Login for 335 more consecutive days to earn Yearly Warrior!',
      'welcome-aboard': 'Explore security tools, join discussions, and start your cybersecurity journey!'
    };

    return hints[badgeId as keyof typeof hints];
  }

  public static generateEmailHTML(props: {
    userName: string;
    badgeTitle: string;
    badgeDescription: string;
    badgeType: 'security' | 'scanner' | 'researcher' | 'content' | 'community' | 'streak' | 'welcome';
    totalBadges: number;
    nextBadgeHint?: string;
  }): string {
    const badgeColors = {
      security: '#3b82f6',
      scanner: '#10b981',
      researcher: '#ef4444',
      content: '#8b5cf6',
      community: '#f59e0b',
      streak: '#06b6d4',
      welcome: '#22c55e'
    };

    const badgeEmojis = {
      security: '🛡️',
      scanner: '⚡',
      researcher: '🏆',
      content: '📝',
      community: '👥',
      streak: '📅',
      welcome: '🎉'
    };

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Badge Earned - IECA</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: #ffffff; padding: 30px 20px; text-align: center;">
                <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 24px;">🎯</span>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
                    🎉 Achievement Unlocked!
                </h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                    IECA Cybersecurity Platform
                </p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">
                        Congratulations, ${props.userName}!
                    </h2>
                    <p style="color: #6b7280; margin: 0; font-size: 16px;">
                        You've earned a new achievement badge
                    </p>
                </div>

                <!-- Badge Display -->
                <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: 3px solid ${badgeColors[props.badgeType]}; border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 64px; margin-bottom: 15px; line-height: 1;">
                        ${badgeEmojis[props.badgeType]}
                    </div>
                    <h3 style="color: ${badgeColors[props.badgeType]}; margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">
                        ${props.badgeTitle}
                    </h3>
                    <p style="color: #4b5563; margin: 0; font-size: 16px; line-height: 1.5;">
                        ${props.badgeDescription}
                    </p>
                </div>

                <!-- Stats -->
                <div style="background-color: #f9fafb; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-around; align-items: center; text-align: center;">
                        <div>
                            <div style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 5px;">
                                ${props.totalBadges}
                            </div>
                            <div style="color: #6b7280; font-size: 14px; font-weight: 500;">
                                Total Badges
                            </div>
                        </div>
                        <div style="width: 2px; height: 40px; background-color: #e5e7eb;"></div>
                        <div>
                            <div style="font-size: 32px; margin-bottom: 5px;">
                                🏆
                            </div>
                            <div style="color: #6b7280; font-size: 14px; font-weight: 500;">
                                Achievement
                            </div>
                        </div>
                    </div>
                </div>

                ${props.nextBadgeHint ? `
                <!-- Next Challenge -->
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                    <h4 style="color: #d97706; margin: 0 0 10px 0; font-size: 18px;">
                        💡 Next Challenge
                    </h4>
                    <p style="color: #92400e; margin: 0; font-size: 15px; line-height: 1.5;">
                        ${props.nextBadgeHint}
                    </p>
                </div>
                ` : ''}

                <!-- Call to Action -->
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:9002'}/portal/profile" 
                       style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block; margin-bottom: 15px;">
                        🎖️ View My Profile
                    </a>
                    <br />
                    <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:9002'}/portal/leaderboard" 
                       style="color: #3b82f6; text-decoration: none; font-size: 14px; font-weight: 500;">
                        📊 Check Leaderboard Rankings
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
                    Keep up the great work! Continue your cybersecurity journey with IECA.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  static async sendBadgeEarnedEmail({
    userId,
    userEmail,
    userName,
    badge,
    totalBadges,
    nextBadgeHint
  }: EmailBadgeNotificationProps): Promise<boolean> {
    try {
      // Check if we already sent this badge email
      const existingEmail = await prisma.emailLog.findFirst({
        where: {
          recipient: userEmail,
          subject: `🎉 Badge Earned: ${badge.title}`,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
          }
        }
      });

      if (existingEmail) {
        console.log('Badge email already sent recently');
        return true;
      }

      const emailHtml = this.generateEmailHTML({
        userName,
        badgeTitle: badge.title,
        badgeDescription: badge.description,
        badgeType: badge.type,
        totalBadges,
        nextBadgeHint: nextBadgeHint || this.getNextBadgeHint(badge.id)
      });

      const mailOptions = {
        from: `"IECA Cybersecurity" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: `🎉 Badge Earned: ${badge.title}`,
        html: emailHtml,
        text: `Congratulations ${userName}! You've earned the ${badge.title} badge. ${badge.description}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Badge email sent:', result.messageId);

      // Log the email
      await prisma.emailLog.create({
        data: {
          recipient: userEmail,
          subject: `🎉 Badge Earned: ${badge.title}`,
          status: 'SENT',
          sentAt: new Date(),
          metadata: {
            badgeId: badge.id,
            badgeTitle: badge.title,
            totalBadges: totalBadges
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to send badge email:', error);
      
      // Log the failed email
      await prisma.emailLog.create({
        data: {
          recipient: userEmail,
          subject: `🎉 Badge Earned: ${badge.title}`,
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            badgeId: badge.id,
            badgeTitle: badge.title
          }
        }
      });

      return false;
    }
  }

  // Special welcome email for first login badge
  static async sendWelcomeEmail({
    userId,
    userEmail,
    userName,
    badge,
    totalBadges
  }: {
    userId: string;
    userEmail: string;
    userName: string;
    badge: Badge;
    totalBadges: number;
  }): Promise<boolean> {
    try {
      const welcomeEmailHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to IECA - Your Cybersecurity Journey Begins!</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
                    <div style="background-color: rgba(255, 255, 255, 0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                        🎉
                    </div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Welcome to IECA!
                    </h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 18px;">
                        Your cybersecurity journey starts here
                    </p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #1e293b; margin: 0 0 15px; font-size: 24px; font-weight: 600;">
                            🏆 First Badge Earned!
                        </h2>
                        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
                            <div style="font-size: 24px; margin-bottom: 8px;">🎉</div>
                            <h3 style="margin: 0; font-size: 20px; font-weight: 600;">${badge.title}</h3>
                            <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">${badge.description}</p>
                        </div>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <h3 style="color: #1e293b; margin: 0 0 20px; font-size: 20px;">Hello ${userName}! 👋</h3>
                        <p style="color: #64748b; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
                            Congratulations on joining the <strong>India Ethical Cyber Army (IECA)</strong> community! 
                            You've just earned your first badge and taken the first step in your cybersecurity journey.
                        </p>
                        <p style="color: #64748b; line-height: 1.6; margin: 0 0 25px; font-size: 16px;">
                            As a member of IECA, you now have access to cutting-edge security tools, educational resources, 
                            and a vibrant community of ethical hackers and cybersecurity professionals.
                        </p>
                    </div>

                    <!-- Getting Started Section -->
                    <div style="background-color: #f1f5f9; padding: 25px; border-radius: 12px; margin: 25px 0;">
                        <h4 style="color: #1e293b; margin: 0 0 15px; font-size: 18px; font-weight: 600;">🚀 Getting Started</h4>
                        <ul style="color: #64748b; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li style="margin-bottom: 8px;">🛡️ <strong>Explore Security Tools:</strong> Try our collection of ethical hacking tools</li>
                            <li style="margin-bottom: 8px;">📚 <strong>Learn & Practice:</strong> Access educational content and practice labs</li>
                            <li style="margin-bottom: 8px;">👥 <strong>Join Discussions:</strong> Connect with fellow cybersecurity enthusiasts</li>
                            <li style="margin-bottom: 8px;">🏆 <strong>Earn More Badges:</strong> Complete challenges and unlock achievements</li>
                            <li>📝 <strong>Share Knowledge:</strong> Write blog posts and share your expertise</li>
                        </ul>
                    </div>

                    <!-- Call to Action -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:9002'}/portal" 
                           style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);">
                            Explore Your Dashboard 🚀
                        </a>
                    </div>

                    <!-- Statistics -->
                    <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 25px 0;">
                        <h4 style="margin: 0 0 10px; font-size: 16px; opacity: 0.9;">Your Progress</h4>
                        <div style="font-size: 24px; font-weight: 700; margin: 0;">${totalBadges} Badge${totalBadges === 1 ? '' : 's'} Earned</div>
                        <p style="margin: 5px 0 0; opacity: 0.8; font-size: 14px;">Keep going to unlock more achievements!</p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0 0 10px; font-size: 14px;">
                        Welcome to the IECA community! We're excited to have you aboard.
                    </p>
                    <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                        India Ethical Cyber Army (IECA) - Building a Safer Digital India
                    </p>
                </div>
            </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"IECA Cybersecurity" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: `🎉 Welcome to IECA - Your Cybersecurity Journey Begins!`,
        html: welcomeEmailHTML,
        text: `Welcome to IECA, ${userName}! 

Congratulations on joining the India Ethical Cyber Army community! You've earned your first badge: "${badge.title}" - ${badge.description}

As a member of IECA, you now have access to:
• Cutting-edge security tools and resources
• Educational content and practice labs  
• A vibrant community of ethical hackers
• Achievement badges and challenges
• Knowledge sharing opportunities

Get started by exploring your dashboard: ${process.env.NEXT_PUBLIC_URL || 'http://localhost:9002'}/portal

Total Badges Earned: ${totalBadges}

Welcome aboard! 🚀`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);

      // Log successful email
      await prisma.emailLog.create({
        data: {
          recipient: userEmail,
          subject: `🎉 Welcome to IECA - Your Cybersecurity Journey Begins!`,
          status: 'SENT',
          metadata: {
            badgeId: badge.id,
            badgeTitle: badge.title,
            emailType: 'welcome',
            isFirstLogin: true
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);

      // Log failed email
      await prisma.emailLog.create({
        data: {
          recipient: userEmail,
          subject: `🎉 Welcome to IECA - Your Cybersecurity Journey Begins!`,
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            badgeId: badge.id,
            badgeTitle: badge.title,
            emailType: 'welcome',
            isFirstLogin: true
          }
        }
      });

      return false;
    }
  }

  static async sendMultipleBadgesEmail(
    userEmail: string,
    userName: string,
    badges: Badge[],
    totalBadges: number
  ): Promise<boolean> {
    try {
      const badgesList = badges.map(badge => `• ${badge.title}: ${badge.description}`).join('\n');
      
      const mailOptions = {
        from: `"IECA Cybersecurity" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: `🎉 ${badges.length} New Badges Earned!`,
        html: `
        <h2>Congratulations ${userName}!</h2>
        <p>You've earned ${badges.length} new badges:</p>
        <ul>
          ${badges.map(badge => `<li><strong>${badge.title}</strong>: ${badge.description}</li>`).join('')}
        </ul>
        <p>Total Badges: ${totalBadges}</p>
        <p><a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:9002'}/portal/profile">View Your Profile</a></p>
        `,
        text: `Congratulations ${userName}! You've earned ${badges.length} new badges:\n${badgesList}\n\nTotal Badges: ${totalBadges}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Multiple badges email sent:', result.messageId);

      return true;
    } catch (error) {
      console.error('Failed to send multiple badges email:', error);
      return false;
    }
  }

  // Method to check user's badges and send emails for new ones
  static async checkAndSendBadgeEmails(userId: string): Promise<boolean> {
    try {
      // Get user information
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          id: true, 
          email: true, 
          name: true,
          profile: true,
          lastLoginAt: true,
          createdAt: true
        }
      });

      if (!user) {
        console.error('User not found:', userId);
        return false;
      }

      // Calculate user's current badges (same logic as in user stats API)
      const [
        securityUsageCount,
        securityScansCount,
        vulnerabilityReportsCount,
        blogPostsCount,
        chatMessagesCount
      ] = await Promise.all([
        prisma.securityToolUsage.count({
          where: { 
            userId: user.id, 
            status: 'COMPLETED' 
          }
        }),
        prisma.securityScan.count({
          where: { 
            userId: user.id, 
            status: 'COMPLETED' 
          }
        }),
        prisma.vulnerabilityReport.count({
          where: { userId: user.id }
        }),
        prisma.blogPost.count({
          where: { 
            authorId: user.id, 
            status: 'PUBLISHED' 
          }
        }),
        prisma.chatMessage.count({
          where: { userId: user.id }
        })
      ]);

      // Calculate badges
      const badges = [];
      let badgeCount = 0;

      // Security Expert badges
      if (securityUsageCount >= 50) {
        badges.push({
          id: 'security-expert',
          title: 'Security Expert',
          description: 'Used 50+ security tools',
          icon: 'ShieldCheck',
          type: 'security' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      } else if (securityUsageCount >= 20) {
        badges.push({
          id: 'security-enthusiast',
          title: 'Security Enthusiast',
          description: 'Used 20+ security tools',
          icon: 'Target',
          type: 'security' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      }

      // Scanner badges
      if (securityScansCount >= 25) {
        badges.push({
          id: 'master-scanner',
          title: 'Master Scanner',
          description: 'Completed 25+ security scans',
          icon: 'Zap',
          type: 'scanner' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      } else if (securityScansCount >= 10) {
        badges.push({
          id: 'scanner',
          title: 'Scanner',
          description: 'Completed 10+ security scans',
          icon: 'Target',
          type: 'scanner' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      }

      // Researcher badges
      if (vulnerabilityReportsCount >= 10) {
        badges.push({
          id: 'security-researcher',
          title: 'Security Researcher',
          description: 'Submitted 10+ vulnerability reports',
          icon: 'Award',
          type: 'researcher' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      } else if (vulnerabilityReportsCount >= 5) {
        badges.push({
          id: 'bug-hunter',
          title: 'Bug Hunter',
          description: 'Submitted 5+ vulnerability reports',
          icon: 'Target',
          type: 'researcher' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      }

      // Content Creator badges
      if (blogPostsCount >= 10) {
        badges.push({
          id: 'content-creator',
          title: 'Content Creator',
          description: 'Published 10+ blog posts',
          icon: 'Award',
          type: 'content' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      } else if (blogPostsCount >= 3) {
        badges.push({
          id: 'blogger',
          title: 'Blogger',
          description: 'Published 3+ blog posts',
          icon: 'Target',
          type: 'content' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      }

      // Community badges
      if (chatMessagesCount >= 100) {
        badges.push({
          id: 'community-leader',
          title: 'Community Leader',
          description: 'Sent 100+ chat messages',
          icon: 'Award',
          type: 'community' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      }

      // First Login Welcome Badge - Check if this is user's first interaction
      const isFirstLogin = await this.checkFirstLogin(user.id);
      if (isFirstLogin) {
        badges.push({
          id: 'welcome-aboard',
          title: 'Welcome Aboard!',
          description: 'Successfully joined the IECA cybersecurity community',
          icon: 'UserPlus',
          type: 'welcome' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      }

      // Login streak badges
      const loginStreak = await this.calculateLoginStreak(user.id);
      
      if (loginStreak >= 365) {
        badges.push({
          id: 'yearly-warrior',
          title: 'Yearly Warrior',
          description: 'Logged in continuously for 365+ days',
          icon: 'Crown',
          type: 'streak' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      } else if (loginStreak >= 30) {
        badges.push({
          id: 'monthly-champion',
          title: 'Monthly Champion',
          description: 'Logged in continuously for 30+ days',
          icon: 'Trophy',
          type: 'streak' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      } else if (loginStreak >= 7) {
        badges.push({
          id: 'weekly-warrior',
          title: 'Weekly Warrior',
          description: 'Logged in continuously for 7+ days',
          icon: 'Calendar',
          type: 'streak' as const,
          earnedAt: new Date().toISOString(),
        });
        badgeCount++;
      }

      // Send email notifications for badges
      if (badges.length > 0) {
        for (const badge of badges) {
          try {
            // Use special welcome email for first login badge
            if (badge.type === 'welcome') {
              await this.sendWelcomeEmail({
                userId: user.id,
                userEmail: user.email,
                userName: user.name || 'User',
                badge,
                totalBadges: badgeCount
              });
            } else {
              await this.sendBadgeEarnedEmail({
                userId: user.id,
                userEmail: user.email,
                userName: user.name || 'User',
                badge,
                totalBadges: badgeCount,
                nextBadgeHint: this.getNextBadgeHint(badge.id)
              });
            }
          } catch (error) {
            console.error('Error sending badge email:', error);
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking and sending badge emails:', error);
      return false;
    }
  }

  // Helper method to calculate login streak
  private static async calculateLoginStreak(userId: string): Promise<number> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          lastLoginAt: true,
          createdAt: true,
        }
      });

      if (!user || !user.lastLoginAt) return 0;

      const now = new Date();
      const lastLogin = new Date(user.lastLoginAt);
      const daysDifference = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

      // Get user's activity frequency to estimate login consistency
      const [recentActivity, totalActivity] = await Promise.all([
        prisma.securityToolUsage.count({
          where: { 
            userId: userId,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        prisma.securityToolUsage.count({
          where: { userId: userId }
        })
      ]);

      // Enhanced calculation based on activity patterns
      let estimatedStreak = 0;
      
      if (daysDifference <= 7) {
        if (recentActivity >= 20) {
          estimatedStreak = 365;
        } else if (recentActivity >= 10) {
          estimatedStreak = 30;
        } else if (recentActivity >= 5) {
          estimatedStreak = 7;
        }
      }

      return estimatedStreak;
    } catch (error) {
      console.error('Error calculating login streak:', error);
      return 0;
    }
  }

  // Helper method to check if this is user's first login/activity
  private static async checkFirstLogin(userId: string): Promise<boolean> {
    try {
      // Check if user has any previous activity or if this is truly their first time
      const [
        hasSecurityUsage,
        hasScans,
        hasReports,
        hasPosts,
        hasMessages,
        hasEmailLog
      ] = await Promise.all([
        prisma.securityToolUsage.count({ where: { userId } }),
        prisma.securityScan.count({ where: { userId } }),
        prisma.vulnerabilityReport.count({ where: { userId } }),
        prisma.blogPost.count({ where: { authorId: userId } }),
        prisma.chatMessage.count({ where: { userId } }),
        prisma.emailLog.count({ 
          where: { 
            recipient: { contains: userId },
            subject: { contains: 'Welcome Aboard' }
          } 
        })
      ]);

      // If user has no activity and hasn't received a welcome email, it's their first time
      const hasAnyActivity = hasSecurityUsage > 0 || hasScans > 0 || hasReports > 0 || hasPosts > 0 || hasMessages > 0;
      const hasWelcomeEmail = hasEmailLog > 0;

      return !hasAnyActivity && !hasWelcomeEmail;
    } catch (error) {
      console.error('Error checking first login:', error);
      return false;
    }
  }
}
