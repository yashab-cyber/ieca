'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, CheckCircle, XCircle, Eye, Star, Mic, Shield } from "lucide-react";
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ApplicationStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

const statusColors: Record<ApplicationStatus, string> = {
    "PENDING": "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    "UNDER_REVIEW": "bg-blue-500/20 text-blue-500 border-blue-500/30",
    "APPROVED": "bg-green-500/20 text-green-500 border-green-500/30",
    "REJECTED": "bg-red-500/20 text-red-500 border-red-500/30",
};

// Helper function to convert database status to display format
const getDisplayStatus = (status: ApplicationStatus): string => {
    switch (status) {
        case 'PENDING': return 'Pending';
        case 'UNDER_REVIEW': return 'Under Review';
        case 'APPROVED': return 'Approved';
        case 'REJECTED': return 'Rejected';
        default: return status;
    }
};

function AdminLogin({ onLogin }: { onLogin: (success: boolean) => void }) {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email');
    const password = formData.get('password');

    if (email === 'yashabalam707@gmail.com' && password === '@Ethicalhacker07') {
      onLogin(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the Admin Dashboard.",
      });
    } else {
      onLogin(false);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-secondary/30">
      <Card className="w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline text-accent">Admin Panel Access</CardTitle>
          <CardDescription className="text-muted-foreground">
            Please enter your credentials to proceed.
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
                placeholder="yashabalam707@gmail.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                required 
              />
            </div>
            <Button type="submit" className="w-full">
              Authenticate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


export default function AdminPage() {
    const { toast } = useToast();
    const [resources, setResources] = React.useState<any[]>([]);
    const [applications, setApplications] = React.useState<any[]>([]);
    const [editingResource, setEditingResource] = React.useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // Load data when component mounts and when authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            loadApplications();
            loadResources();
        }
    }, [isAuthenticated]);

    const loadApplications = async () => {
        try {
            const response = await fetch('/api/applications');
            const data = await response.json();
            if (data.success) {
                setApplications(data.applications);
            }
        } catch (error) {
            console.error('Error loading applications:', error);
            toast({
                title: "Error",
                description: "Failed to load applications",
                variant: "destructive",
            });
        }
    };

    const loadResources = async () => {
        try {
            const response = await fetch('/api/resources');
            const result = await response.json();
            if (result.success) {
                setResources(result.data);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error loading resources:', error);
            toast({
                title: "Error",
                description: "Failed to load resources",
                variant: "destructive",
            });
        }
    };

    const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/applications/${applicationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            const result = await response.json();
            if (result.success) {
                // Reload applications to get updated data
                await loadApplications();
                toast({
                    title: "Status Updated",
                    description: `Application status changed to ${status}`,
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error updating application:', error);
            toast({
                title: "Error",
                description: "Failed to update application status",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
        await updateApplicationStatus(applicationId, status);
    };

    const handleApprove = async (applicationId: string) => {
        await updateApplicationStatus(applicationId, 'APPROVED');
    };

    const handleReject = async (applicationId: string) => {
        await updateApplicationStatus(applicationId, 'REJECTED');
    };

    if (!isAuthenticated) {
      return <AdminLogin onLogin={setIsAuthenticated} />;
    }

    const handleEdit = (resource: any) => {
        setEditingResource(resource);
    };
    
    const handleDelete = async (id: string) => {
        if(confirm(`Are you sure you want to delete this resource?`)) {
            try {
                setLoading(true);
                const response = await fetch(`/api/resources/${id}`, {
                    method: 'DELETE',
                });

                const result = await response.json();
                if (result.success) {
                    await loadResources(); // Reload resources
                    toast({ 
                        title: "Success", 
                        description: "Resource deleted successfully!" 
                    });
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Error deleting resource:', error);
                toast({
                    title: "Error",
                    description: "Failed to delete resource",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      
      const resourceData = {
          title: formData.get('title') as string,
          description: formData.get('summary') as string,
          content: formData.get('content') as string,
          category: formData.get('category') as string || 'General',
          tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [],
          authorName: formData.get('author') as string,
          difficulty: (formData.get('difficulty') as string || 'BEGINNER') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
      };

      try {
          setLoading(true);
          let response;
          
          if (editingResource) {
              response = await fetch(`/api/resources/${editingResource.id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(resourceData),
              });
          } else {
              response = await fetch('/api/resources', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(resourceData),
              });
          }

          const result = await response.json();
          if (result.success) {
              await loadResources(); // Reload resources
              toast({ 
                  title: "Success", 
                  description: editingResource ? "Resource updated successfully!" : "New resource published successfully!" 
              });
              setEditingResource(null);
              (event.target as HTMLFormElement).reset();
          } else {
              throw new Error(result.message);
          }
      } catch (error) {
          console.error('Error saving resource:', error);
          toast({
              title: "Error",
              description: "Failed to save resource",
              variant: "destructive",
          });
      } finally {
          setLoading(false);
      }
    };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold font-headline mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
          <TabsTrigger value="applications">Manage Applications</TabsTrigger>
          <TabsTrigger value="content">Manage Library</TabsTrigger>
          <TabsTrigger value="add">
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Volunteer Applications</CardTitle>
                    <CardDescription>Review, approve, or reject applications from prospective volunteers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead className="hidden md:table-cell">Email</TableHead>
                                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.name}</TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">{app.email}</TableCell>
                                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                       <Select 
                                         value={app.status} 
                                         onValueChange={(value: ApplicationStatus) => handleStatusChange(app.id, value)}
                                         disabled={loading}
                                       >
                                            <SelectTrigger className="w-[150px] text-xs h-8">
                                                <SelectValue placeholder="Set status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                                                <SelectItem value="APPROVED">Approved</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">View Details</span>
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-green-500 hover:text-green-500"
                                            onClick={() => handleApprove(app.id)}
                                            disabled={loading}
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="sr-only">Approve</span>
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleReject(app.id)}
                                            disabled={loading}
                                        >
                                            <XCircle className="h-4 w-4" />
                                            <span className="sr-only">Reject</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Library Resources</CardTitle>
              <CardDescription>View, edit, or delete published resources for the member library.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Author</TableHead>
                       <TableHead className="hidden md:table-cell">Tags</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{resource.author}</TableCell>
                        <TableCell className="hidden md:table-cell">
                           <div className="flex gap-1">
                            {resource.tags?.split(',').map((tag: string) => <Badge key={tag} variant="secondary" className="whitespace-nowrap">{tag.trim()}</Badge>)}
                           </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{resource.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => toast({title: "Bookmark Clicked", description: "This resource has been added to your bookmarks."})}>
                              <Star className="h-4 w-4" />
                              <span className="sr-only">Bookmark</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(resource)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(resource.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingResource ? 'Edit Resource' : 'Create a New Resource'}</CardTitle>
              <CardDescription>
                {editingResource
                  ? 'Update the details for the existing resource.'
                  : 'Fill in the details below to publish a new resource.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Resource Title</Label>
                        <Input id="title" name="title" placeholder="e.g., Advanced Pen Testing" defaultValue={editingResource?.title} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">Author Name</Label>
                        <Input id="author" name="author" placeholder="e.g., Arjun Sharma" defaultValue={editingResource?.author} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" name="imageUrl" placeholder="https://placehold.co/600x400.png" defaultValue={editingResource?.imageUrl} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" name="tags" placeholder="e.g., pentesting, red-team" defaultValue={editingResource?.tags} />
                    </div>
                 </div>
                 <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea id="summary" name="summary" placeholder="A brief summary of the resource..." defaultValue={editingResource?.summary} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Full Content (Markdown supported)</Label>
                  <Textarea id="content" name="content" placeholder="Write the full resource content here..." className="min-h-[250px]" defaultValue={editingResource?.content} required />
                </div>
                 <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <Button type="submit">{editingResource ? 'Update Resource' : 'Publish Resource'}</Button>
                        {editingResource && (
                            <Button variant="outline" onClick={() => { setEditingResource(null); }}>Cancel</Button>
                        )}
                    </div>
                     <Button variant="outline" size="icon" onClick={(e) => {e.preventDefault(); toast({title: "Voice Command Activated", description: "Ready to accept voice input."})}}>
                        <Mic className="h-4 w-4" />
                        <span className="sr-only">Use Voice Command</span>
                    </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
