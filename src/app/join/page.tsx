
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const skills = [
  { id: "pentesting", label: "Penetration Testing" },
  { id: "forensics", label: "Digital Forensics" },
  { id: "malware", label: "Malware Analysis" },
  { id: "cloud", label: "Cloud Security" },
  { id: "incident", label: "Incident Response" },
  { id: "threat", label: "Threat Intelligence" },
] as const;


const formSchema = z.object({
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

// This is a placeholder for a real email sending function.
// In a production app, this would use a service like Resend, SendGrid, or AWS SES.
async function sendApplicationEmails(data: z.infer<typeof formSchema>) {
  console.log("--- Sending Application Confirmation Email ---");
  console.log("To:", data.email);
  console.log("From: noreply@ieca.gov.in");
  console.log("Subject: Your IECA Volunteer Application has been received");
  console.log("Body:", `Hi ${data.name},\n\nThank you for applying to join the Indian Error Cyber Army. We have received your application and our volunteer review board will assess it shortly.\n\nWe appreciate your commitment to helping secure India's digital future.\n\nRegards,\nThe IECA Team`);
  
  console.log("\n--- Sending Admin Notification Email ---");
  console.log("To: admin@ieca.gov.in");
  console.log("From: system@ieca.gov.in");
  console.log("Subject: New Volunteer Application Received");
  console.log("Body:", `A new application has been submitted by ${data.name} (${data.email}). Please review it in the admin dashboard.`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("--- Emails Sent (Simulated) ---");
  return { success: true };
}

export default function JoinPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      skills: [],
      statement: "",
      isIndianCitizen: false,
      agreement: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // In a real app, you'd call your email service here
      await sendApplicationEmails(values);

      toast({
        title: "Application Received!",
        description: "Thank you for your interest. A confirmation email has been sent to your address.",
      });
      form.reset();
    } catch (error) {
       console.error("Failed to submit application:", error);
       toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again later.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Join Our Mission</h1>
        <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">
          Become a part of a collective of India's top ethical hackers, united to protect our nation's digital future. If you have the skills and the passion, we want to hear from you.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Volunteer Application Form</CardTitle>
          <CardDescription>Please fill out the form below with as much detail as possible. All information will be kept confidential.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Priya Singh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="priya.singh@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Profile (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Your Skills</FormLabel>
                      <FormDescription>
                        Select all areas where you have expertise.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {skills.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="skills"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why do you want to join IECA?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your motivation, relevant experience, and how you believe you can contribute to our mission..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isIndianCitizen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                         I confirm that I am a citizen of India.
                        </FormLabel>
                        <FormDescription>
                          Membership is open only to Indian citizens who wish to contribute to the nation's cybersecurity.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to abide by the IECA code of conduct and ethics policy.
                        </FormLabel>
                        <FormDescription>
                          You must agree to our ethical guidelines to proceed. All volunteer work is pro-bono.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full md:w-auto" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
