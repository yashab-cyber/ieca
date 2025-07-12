# IECA Email System Documentation

## Overview

The IECA platform includes a comprehensive email system for automated user communications, built with Nodemailer and professional HTML templates.

## 📧 Features

### Automated Email Types

1. **Welcome Emails** - Sent when new users register
2. **Application Confirmations** - Sent when membership applications are submitted
3. **Application Status Updates** - Sent when applications are approved/rejected
4. **Password Reset Emails** - Sent for password recovery requests
5. **Contact Form Notifications** - Sent to admins when contact forms are submitted
6. **General Notifications** - Sent for system notifications and updates

### Email Templates

All emails use professional HTML templates with:
- **IECA Branding** - Consistent visual identity
- **Mobile Responsive** - Works on all devices
- **Security Headers** - Proper email authentication
- **Handlebars Templating** - Dynamic content insertion

## 🔧 Configuration

### Environment Variables

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com          # Your SMTP server
SMTP_PORT=587                     # SMTP port (587 for TLS, 465 for SSL)
SMTP_USER=your-email@gmail.com    # SMTP username
SMTP_PASSWORD=your-app-password   # SMTP password (use app password for Gmail)
EMAIL_FROM=noreply@ieca.zehrasec.com  # Default sender email
ADMIN_EMAILS=admin@ieca.zehrasec.com,security@ieca.zehrasec.com  # Admin notification emails
```

### Popular Email Providers

#### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Generate from Google Account settings
```

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

#### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
```

#### Custom SMTP
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
```

## 🚀 Usage

### Programmatic Usage

```typescript
import { emailService } from '@/lib/email';

// Send welcome email
await emailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Send application confirmation
await emailService.sendApplicationConfirmation(
  'user@example.com', 
  'John Doe', 
  'APP-123-456'
);

// Send application status update
await emailService.sendApplicationStatusUpdate(
  'user@example.com',
  'John Doe',
  'approved',
  'Welcome to IECA!'
);

// Send password reset
await emailService.sendPasswordResetEmail(
  'user@example.com',
  'John Doe',
  'reset-token-123'
);

// Send notification
await emailService.sendNotificationEmail(
  'user@example.com',
  'John Doe',
  'Security Alert',
  'Your account was accessed from a new device.'
);
```

### API Testing

Use the `/api/email/test` endpoint to test email functionality:

```bash
# Check email configuration
curl -X GET http://localhost:3000/api/email/test

# Send test email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Admin Panel

Access the email management interface at `/admin/email` to:
- Check configuration status
- Send test emails
- View email templates
- Monitor email delivery

## 📁 File Structure

```
src/lib/
├── email.ts                    # Email service class
└── email-templates/           # HTML email templates
    ├── welcome.hbs            # Welcome email template
    ├── application-confirmation.hbs  # Application confirmation
    ├── application-status.hbs       # Status update template
    ├── password-reset.hbs          # Password reset template
    ├── contact-form.hbs           # Contact form notification
    └── notification.hbs          # General notification template
```

## 🔒 Security Features

- **SMTP Authentication** - Secure connection to email providers
- **Template Security** - Prevents injection attacks
- **Rate Limiting** - Prevents email spam
- **Error Handling** - Graceful failure without exposing sensitive data
- **Logging** - Comprehensive email activity logging

## 🛠️ Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Check SMTP credentials in environment variables
   - Verify SMTP server settings
   - Check firewall/network restrictions
   - Enable "Less Secure Apps" for Gmail (not recommended) or use App Password

2. **Gmail Authentication Issues**
   - Generate App Password from Google Account settings
   - Use App Password instead of regular password
   - Enable 2-factor authentication

3. **Template Errors**
   - Ensure all template variables are provided
   - Check template syntax for Handlebars errors
   - Verify template files exist in the correct directory

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📊 Monitoring

The email system includes:
- **Success/Failure Logging** - All email attempts are logged
- **Error Tracking** - Failed emails are tracked with error details
- **Performance Metrics** - Email delivery timing
- **Template Usage** - Track which templates are used most

## 🔄 Maintenance

### Regular Tasks

1. **Monitor Email Delivery** - Check logs for failed emails
2. **Update Templates** - Keep email templates current with branding
3. **Review SMTP Configuration** - Ensure credentials are secure and current
4. **Test Email Functionality** - Regular testing of all email types

### Backup and Recovery

- **Template Backups** - Keep copies of email templates
- **Configuration Backups** - Document SMTP settings
- **Logs Archival** - Regular archival of email logs

## 📈 Performance Optimization

- **Connection Pooling** - Efficient SMTP connections
- **Template Caching** - Compiled templates are cached
- **Async Processing** - Emails are sent asynchronously
- **Error Recovery** - Automatic retry for failed sends

## 🔗 Integration

The email system integrates with:
- **User Registration** - Automatic welcome emails
- **Application System** - Status notifications
- **Contact Forms** - Admin notifications
- **Security System** - Password reset emails
- **Notification System** - General alerts

## 📞 Support

For email system issues:
1. Check the admin panel at `/admin/email`
2. Review server logs for error messages
3. Verify SMTP configuration
4. Test with the API endpoint `/api/email/test`

---

**Built with ❤️ for India's Digital Security by IECA Team**
