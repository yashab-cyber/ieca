
'use client';

import React from 'react';
import LoginPage from '../login/page';
import { useToast } from '@/hooks/use-toast';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const { toast } = useToast();

    const handleLogin = (success: boolean) => {
        if (success) {
            setIsAuthenticated(true);
            toast({
                title: "Login Successful",
                description: "Welcome to the Member Portal.",
            });
        } else {
            setIsAuthenticated(false);
            toast({
                title: "Login Failed",
                description: "Invalid email or password. Please try again.",
                variant: "destructive",
            });
        }
    };
    
    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return <>{children}</>;
}
