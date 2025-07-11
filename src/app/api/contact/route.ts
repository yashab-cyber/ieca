import { NextRequest, NextResponse } from 'next/server';
import { contactService } from '@/lib/services';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(20, "Message must be at least 20 characters."),
  type: z.enum(['GENERAL', 'THREAT_REPORT', 'SUPPORT', 'PARTNERSHIP', 'MEDIA']).optional(),
  isUrgent: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input
    const validatedData = contactSchema.parse(body);
    
    // Submit the contact form
    const contactForm = await contactService.submitContactForm({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      type: validatedData.type || 'GENERAL',
      isUrgent: validatedData.isUrgent || false,
    });

    // Send confirmation email to user
    await sendContactConfirmationEmail(contactForm);
    
    // Send notification to admin
    await sendContactNotificationEmail(contactForm);

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
      contactId: contactForm.id,
    });

  } catch (error) {
    console.error('Contact form submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to send message. Please try again.",
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint is for admin use only
    // TODO: Add authentication middleware
    
    const contactForms = await contactService.getAllContactForms();
    
    return NextResponse.json({
      success: true,
      contacts: contactForms,
    });

  } catch (error) {
    console.error('Failed to fetch contact forms:', error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to fetch contact forms",
    }, { status: 500 });
  }
}

// Email service functions (placeholders)
async function sendContactConfirmationEmail(contact: any) {
  console.log("--- Sending Contact Form Confirmation Email ---");
  console.log("To:", contact.email);
  console.log("From: support@ieca.gov.in");
  console.log("Subject: Your message has been received - IECA");
  console.log("Body:", `Dear ${contact.name},

Thank you for contacting the Indian Error Cyber Army (IECA). We have received your message and will respond within 24-48 hours.

Your Message Details:
- Subject: ${contact.subject}
- Type: ${contact.type}
- Priority: ${contact.isUrgent ? 'Urgent' : 'Normal'}
- Reference ID: ${contact.id}
- Submitted: ${new Date(contact.createdAt).toLocaleString()}

If this is a security emergency, please call our 24/7 hotline: +91-XXXX-XXXXXX

Best regards,
The IECA Support Team`);
  
  // TODO: Implement actual email sending
}

async function sendContactNotificationEmail(contact: any) {
  console.log("\n--- Sending Contact Form Admin Notification ---");
  console.log("To: support@ieca.gov.in");
  console.log("From: system@ieca.gov.in");
  console.log("Subject:", `${contact.isUrgent ? '[URGENT] ' : ''}New Contact Form Submission`);
  console.log("Body:", `A new contact form has been submitted:

From: ${contact.name} (${contact.email})
Subject: ${contact.subject}
Type: ${contact.type}
Priority: ${contact.isUrgent ? 'URGENT' : 'Normal'}

Message:
${contact.message}

Contact ID: ${contact.id}
Submitted: ${new Date(contact.createdAt).toLocaleString()}

${contact.isUrgent ? 'This message has been marked as urgent and requires immediate attention.' : 'Please respond within 24-48 hours.'}`);
  
  // TODO: Implement actual email sending
}
