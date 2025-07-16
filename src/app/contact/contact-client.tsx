
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Users, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be less than 500 characters.").max(500, "Message must be less than 500 characters."),
});

// Send contact form data to API
async function sendContactEmail(data: z.infer<typeof formSchema>) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send message');
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending contact message:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send message' };
  }
}

export default function ContactPageClient() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await sendContactEmail(values);

      if (result.success) {
        toast({
          title: "Message Received!",
          description: "Thank you for reaching out. Our volunteer team will review your message and get back to you shortly.",
        });
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Get in Touch</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          We are a volunteer-driven collective. Whether you need help with a security incident, want to report a vulnerability, or wish to join our cause, we're here for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
           <Card className="bg-primary/5">
             <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full flex-shrink-0">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-headline">Join Our Mission</h3>
                    </div>
                </div>
                 <Button asChild variant="ghost" size="icon">
                    <Link href="/join">
                        <ArrowRight className="h-5 w-5"/>
                    </Link>
                </Button>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground">Are you a cybersecurity professional? Join our mission to protect India. We are always looking for skilled volunteers.</p>
             </CardContent>
           </Card>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full flex-shrink-0">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline">Email Us</h3>
              <p className="text-muted-foreground">contact@ieca.gov.in (General Inquiries)</p>
              <p className="text-muted-foreground">report@ieca.gov.in (Report Incident/Vulnerability)</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full flex-shrink-0">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline">24/7 Helpline</h3>
              <p className="text-muted-foreground">+91-11-2345-6789 (For active security incidents)</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Send us a secure message</CardTitle>
            <CardDescription>Use this form for non-urgent communication. For active incidents, please call our helpline.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Arjun Sharma" {...field} />
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
                        <Input placeholder="arjun.sharma@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Vulnerability Report in Gov Service" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please describe your needs in detail..." className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
