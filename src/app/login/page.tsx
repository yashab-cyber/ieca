
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import Link from "next/link";
import React from 'react';

export default function LoginPage({ onLogin }: { onLogin: (success: boolean) => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // In a real application, you would handle authentication here.
    // For this prototype, we'll just check for mock credentials.
    if (email === 'test.volunteer@ieca.gov.in' && password === 'password123') {
        onLogin(true);
    } else {
        onLogin(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-secondary/30">
      <Card className="w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline text-accent">Member Portal Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Access the IECA secure members-only area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="volunteer@ieca.gov.in"
                required
                defaultValue="test.volunteer@ieca.gov.in"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                required 
                defaultValue="password123"
              />
            </div>
            <Button type="submit" className="w-full">
              Secure Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm text-muted-foreground">
           <p>Don't have an account?</p>
           <Button variant="link" asChild>
             <Link href="/join">Join the mission as a volunteer</Link>
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
