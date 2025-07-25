'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface Resource {
  id: string;
  title: string;
  description?: string;
  content?: string;
  authorName: string;
  createdAt: string;
  fileUrl?: string;
  tags?: string[] | string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources');
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setResources(result.data);
          } else {
            console.error('Invalid response format:', result);
            setResources([]);
          }
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading resources...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Cybersecurity Resource Center</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Your central hub for the latest news, in-depth articles, and expert analysis on the evolving cybersecurity landscape. Stay informed, stay secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(resources) && resources.map((resource) => {
          const tags = Array.isArray(resource.tags) 
            ? resource.tags 
            : typeof resource.tags === 'string' 
              ? resource.tags.split(',').map(tag => tag.trim()) 
              : [];
          return (
            <Card key={resource.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card">
              <div className="relative h-48 w-full">
                <Image 
                  src={resource.fileUrl || "https://placehold.co/600x400.png"} 
                  alt={resource.title} 
                  fill 
                  style={{objectFit: "cover"}} 
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-xl leading-tight">{resource.title}</CardTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{resource.description || 'No description available'}</CardDescription>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <p>By {resource.authorName} on {formatDate(resource.createdAt)}</p>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {(!Array.isArray(resources) || resources.length === 0) && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No resources available at the moment.</p>
        </div>
      )}
    </div>
  );
}
