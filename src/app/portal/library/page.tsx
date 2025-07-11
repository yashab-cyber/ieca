'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  authorName: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  downloads: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function LibraryPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources');
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data = await response.json();
        if (data.success) {
          setResources(data.data);
        } else {
          setError(data.message || 'Failed to load resources');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleDownload = async (resourceId: string) => {
    try {
      // Increment download count
      await fetch(`/api/resources/${resourceId}/download`, {
        method: 'POST',
      });
      
      // Update local state
      setResources(prev => prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, downloads: resource.downloads + 1 }
          : resource
      ));
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Resources</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Knowledge Library</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Access exclusive resources, training materials, and research from our cybersecurity experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource) => (
          <Card key={resource.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <Image
                src="https://placehold.co/600x400.png"
                alt={resource.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{resource.category}</Badge>
                <Badge variant="outline">{resource.difficulty}</Badge>
              </div>
              <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <span>By {resource.authorName}</span>
                <span>{resource.views} views</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleDownload(resource.id)}
                className="w-full"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download ({resource.downloads})
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {resources.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Resources Available</h3>
          <p className="text-muted-foreground">Check back later for new resources.</p>
        </div>
      )}
    </div>
  );
}
