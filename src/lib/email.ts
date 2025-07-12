import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email template data interface
interface EmailTemplateData {
  [key: string]: any;
}

// Email service class
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.initializeTransporter();
    this.loadEmailTemplates();
  }

  /**
   * Initialize the SMTP transporter
   */
  private initializeTransporter() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    // Only create transporter if SMTP is configured
    if (config.auth.user && config.auth.pass) {
      this.transporter = nodemailer.createTransport(config);
      
      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SMTP configuration error:', error);
        } else {
          console.log('✅ SMTP server is ready to send emails');
        }
      });
    } else {
      console.warn('⚠️ SMTP not configured. Email features will be disabled.');
    }
  }

  /**
   * Load email templates from the templates directory
   */
  private loadEmailTemplates() {
    // Register Handlebars helpers
    Handlebars.registerHelper('eq', function(a, b) {
      return a === b;
    });
    
    const templatesDir = path.join(process.cwd(), 'src', 'lib', 'email-templates');
    
    try {
      if (fs.existsSync(templatesDir)) {
        const templateFiles = fs.readdirSync(templatesDir).filter(file => file.endsWith('.hbs'));
        
        templateFiles.forEach(file => {
          const templateName = path.basename(file, '.hbs');
          const templateContent = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
          this.templates.set(templateName, Handlebars.compile(templateContent));
        });
        
        console.log(`📧 Loaded ${templateFiles.length} email templates`);
      }
    } catch (error) {
      console.warn('⚠️ Could not load email templates:', error);
    }
  }

  /**
   * Send an email using a template
   */
  async sendTemplatedEmail(
    to: string | string[],
    templateName: string,
    data: EmailTemplateData,
    subject: string,
    from?: string
  ): Promise<boolean> {
    if (!this.transporter) {
      console.warn('⚠️ Email not sent: SMTP not configured');
      return false;
    }

    const template = this.templates.get(templateName);
    if (!template) {
      console.error(`❌ Email template '${templateName}' not found`);
      return false;
    }

    try {
      const html = template(data);
      
      const mailOptions = {
        from: from || process.env.EMAIL_FROM || 'noreply@ieca.zehrasec.com',
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        attachments: [
          {
            filename: 'ieca-logo.jpg',
            path: path.join(process.cwd(), 'public', 'email', 'ieca-logo.jpg'),
            cid: 'ieca-logo' // Content-ID for embedding in email
          }
        ]
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send a plain text/HTML email
   */
  async sendEmail(
    to: string | string[],
    subject: string,
    text?: string,
    html?: string,
    from?: string
  ): Promise<boolean> {
    if (!this.transporter) {
      console.warn('⚠️ Email not sent: SMTP not configured');
      return false;
    }

    try {
      const mailOptions = {
        from: from || process.env.EMAIL_FROM || 'noreply@ieca.zehrasec.com',
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        text,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send welcome email to new members
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendTemplatedEmail(
      email,
      'welcome',
      { name, platformName: 'IECA', websiteUrl: process.env.NEXTAUTH_URL },
      'Welcome to Indian Error Cyber Army!'
    );
  }

  /**
   * Send application confirmation email
   */
  async sendApplicationConfirmation(email: string, name: string, applicationId: string): Promise<boolean> {
    return this.sendTemplatedEmail(
      email,
      'application-confirmation',
      { 
        name, 
        applicationId, 
        platformName: 'IECA',
        websiteUrl: process.env.NEXTAUTH_URL 
      },
      'Application Received - IECA Membership'
    );
  }

  /**
   * Send application status update email
   */
  async sendApplicationStatusUpdate(
    email: string, 
    name: string, 
    status: 'approved' | 'rejected',
    reason?: string
  ): Promise<boolean> {
    return this.sendTemplatedEmail(
      email,
      'application-status',
      { 
        name, 
        status, 
        reason: reason || '',
        platformName: 'IECA',
        websiteUrl: process.env.NEXTAUTH_URL 
      },
      `Application ${status.charAt(0).toUpperCase() + status.slice(1)} - IECA Membership`
    );
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    return this.sendTemplatedEmail(
      email,
      'password-reset',
      { 
        name, 
        resetUrl,
        platformName: 'IECA',
        websiteUrl: process.env.NEXTAUTH_URL 
      },
      'Password Reset Request - IECA'
    );
  }

  /**
   * Send contact form notification
   */
  async sendContactFormNotification(
    name: string,
    email: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@ieca.zehrasec.com'];
    
    return this.sendTemplatedEmail(
      adminEmails,
      'contact-form',
      { 
        name, 
        email, 
        subject, 
        message,
        platformName: 'IECA' 
      },
      `New Contact Form Submission: ${subject}`
    );
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(
    email: string,
    name: string,
    notificationTitle: string,
    notificationMessage: string
  ): Promise<boolean> {
    return this.sendTemplatedEmail(
      email,
      'notification',
      { 
        name, 
        notificationTitle, 
        notificationMessage,
        platformName: 'IECA',
        websiteUrl: process.env.NEXTAUTH_URL 
      },
      `IECA Notification: ${notificationTitle}`
    );
  }

  /**
   * Check if email service is configured and ready
   */
  isConfigured(): boolean {
    return this.transporter !== null;
  }
}

// Create and export a singleton instance
export const emailService = new EmailService();

// Export the class for testing purposes
export { EmailService };
