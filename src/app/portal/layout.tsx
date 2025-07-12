
'use client';

import React from 'react';
import LoginPage from '../login/page';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { PortalNavigation } from '@/components/portal-navigation';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState<any>(null);
    const { toast } = useToast();

    // Check if user is already logged in on component mount
    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                if (parsedUser && parsedUser.email) {
                    setIsAuthenticated(true);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (success: boolean) => {
        if (success) {
            setIsAuthenticated(true);
            // Re-fetch user data from localStorage after login
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
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

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
    };
    
    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Portal Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-semibold">IECA Portal</span>
                        {user && (
                            <span className="text-muted-foreground">
                                - Welcome, {user.name}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {user && (
                            <span className="text-sm text-muted-foreground">
                                {user.role}
                            </span>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleLogout}
                            className="gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Portal Navigation */}
            <PortalNavigation />
            
            {/* Portal Content */}
            <div className="container mx-auto px-4 py-6">
                {children}
            </div>
        </div>
    );
}
