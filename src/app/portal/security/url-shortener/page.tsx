'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Link, ExternalLink, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UrlShortenerPage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [urlStats, setUrlStats] = useState<any>(null);
  const { toast } = useToast();

  const handleShortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/security/url-shortener', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: originalUrl.trim(),
          customAlias: customAlias.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShortenedUrl(data.shortUrl);
        setUrlStats(data.stats);
        toast({
          title: "Success",
          description: "URL shortened successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to shorten URL');
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to shorten URL",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">URL Shortener</h1>
        <p className="text-muted-foreground">
          Create short, trackable links for your URLs with analytics and security features.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              Shorten URL
            </CardTitle>
            <CardDescription>
              Enter a URL to create a shortened version with tracking capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleShortenUrl} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="originalUrl">Original URL</Label>
                <Input
                  id="originalUrl"
                  type="url"
                  placeholder="https://example.com/very-long-url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customAlias">Custom Alias (Optional)</Label>
                <Input
                  id="customAlias"
                  type="text"
                  placeholder="my-custom-link"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty for auto-generated alias
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {shortenedUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Shortened URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <code className="flex-1 font-mono text-sm">
                  {shortenedUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shortenedUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(shortenedUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              {urlStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 bg-secondary rounded-md">
                    <p className="text-sm text-muted-foreground">Clicks</p>
                    <p className="text-lg font-bold">{urlStats.clickCount || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-md">
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-lg font-bold">
                      {urlStats.createdAt ? new Date(urlStats.createdAt).toLocaleDateString() : 'Today'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-md">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-bold text-green-500">Active</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-md">
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="text-lg font-bold">Never</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Only shorten URLs you trust. Be cautious when clicking shortened links from unknown sources.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Click Tracking</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor clicks, IP addresses, and referrers for analytics
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Custom Aliases</p>
                    <p className="text-sm text-muted-foreground">
                      Create memorable short links with custom aliases
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">No Expiration</p>
                    <p className="text-sm text-muted-foreground">
                      Links remain active indefinitely unless manually disabled
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Secure Storage</p>
                    <p className="text-sm text-muted-foreground">
                      All URLs and analytics data are securely stored and encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
