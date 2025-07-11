import { NextRequest, NextResponse } from 'next/server';
import { applicationService, activityService } from '@/lib/services';
import { z } from 'zod';

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number."),
  linkedin: z.string().url("Please enter a valid LinkedIn URL.").optional().or(z.literal('')),
  github: z.string().url("Please enter a valid GitHub URL.").optional().or(z.literal('')),
  skills: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one skill.",
  }),
  statement: z.string().min(50, "Your statement must be at least 50 characters.").max(1000),
  isIndianCitizen: z.boolean().refine((val) => val === true, "You must confirm you are an Indian citizen to apply."),
  agreement: z.boolean().refine((val) => val === true, "You must agree to the terms."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input
    const validatedData = applicationSchema.parse(body);
    
    // Submit the application
    const application = await applicationService.submitApplication({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      linkedin: validatedData.linkedin || undefined,
      github: validatedData.github || undefined,
      skills: validatedData.skills,
      statement: validatedData.statement,
      isIndianCitizen: validatedData.isIndianCitizen,
    });

    // Log the activity (if user is logged in)
    // For now, we'll use a system log since we don't have user auth yet
    
    // Send confirmation email (placeholder - implement with your email service)
    await sendApplicationConfirmationEmail(application);
    
    // Send admin notification email
    await sendAdminNotificationEmail(application);

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      applicationId: application.id,
    });

  } catch (error) {
    console.error('Application submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to submit application. Please try again.",
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint is for admin use only
    // TODO: Add authentication middleware
    
    const applications = await applicationService.getAllApplications();
    
    return NextResponse.json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error('Failed to fetch applications:', error);
    
    return NextResponse.json({
      success: false,
      message: "Failed to fetch applications",
    }, { status: 500 });
  }
}

// Email service functions (placeholders)
async function sendApplicationConfirmationEmail(application: any) {
  console.log("--- Sending Application Confirmation Email ---");
  console.log("To:", application.email);
  console.log("From: noreply@ieca.gov.in");
  console.log("Subject: Your IECA Volunteer Application has been received");
  console.log("Body:", `Hi ${application.name},

Thank you for applying to join the Indian Error Cyber Army. We have received your application and our volunteer review board will assess it shortly.

Application Details:
- Application ID: ${application.id}
- Skills: ${application.skills.join(', ')}
- Submitted: ${new Date(application.createdAt).toLocaleString()}

We appreciate your commitment to helping secure India's digital future.

Regards,
The IECA Team`);
  
  // TODO: Implement actual email sending with your preferred service
  // Examples: Resend, SendGrid, AWS SES, Nodemailer
}

async function sendAdminNotificationEmail(application: any) {
  console.log("\n--- Sending Admin Notification Email ---");
  console.log("To: admin@ieca.gov.in");
  console.log("From: system@ieca.gov.in");
  console.log("Subject: New Volunteer Application Received");
  console.log("Body:", `A new volunteer application has been submitted:

Applicant: ${application.name}
Email: ${application.email}
Phone: ${application.phone}
Skills: ${application.skills.join(', ')}
LinkedIn: ${application.linkedin || 'Not provided'}
GitHub: ${application.github || 'Not provided'}

Application ID: ${application.id}
Submitted: ${new Date(application.createdAt).toLocaleString()}

Please review the application in the admin panel.`);
  
  // TODO: Implement actual email sending
}
