'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Globe, 
  CheckCircle, 
  XCircle,
  Shield,
  ExternalLink,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubdomainResult {
  subdomain: string;
  ip: string;
  status: 'active' | 'inactive';
  httpStatus?: number;
  title?: string;
  server?: string;
  lastSeen?: string;
}

export default function SubdomainFinderPage() {
  const [domain, setDomain] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SubdomainResult[]>([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [stats, setStats] = useState({ active: 0, inactive: 0, total: 0 });
  const { toast } = useToast();

  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }

    // Basic domain validation
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain.trim())) {
      toast({
        title: "Error",
        description: "Please enter a valid domain name",
        variant: "destructive",
      });
      return;
    }

    setScanning(true);
    setProgress(0);
    setResults([]);
    setScanComplete(false);

    try {
      const response = await fetch('/api/security/subdomain-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domain.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Simulate scanning progress
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setScanning(false);
              setScanComplete(true);
              setResults(data.subdomains || []);
              
              // Calculate stats
              const active = data.subdomains?.filter((s: SubdomainResult) => s.status === 'active').length || 0;
              const inactive = data.subdomains?.filter((s: SubdomainResult) => s.status === 'inactive').length || 0;
              setStats({ active, inactive, total: active + inactive });
              
              toast({
                title: "Scan Complete",
                description: `Found ${data.subdomains?.length || 0} subdomains`,
              });
              return 100;
            }
            return prev + 5;
          });
        }, 200);
      } else {
        throw new Error(data.message || 'Failed to start scan');
      }
    } catch (error) {
      console.error('Error starting scan:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start subdomain scan",
        variant: "destructive",
      });
      setScanning(false);
    }
  };

  const exportResults = () => {
    const csvContent = results.map(sub => 
      `"${sub.subdomain}","${sub.ip}","${sub.status}","${sub.httpStatus || ''}","${sub.server || ''}"`
    ).join('\n');
    
    const blob = new Blob([`"Subdomain","IP Address","Status","HTTP Status","Server"\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subdomains-${domain}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subdomain Finder</h1>
        <p className="text-muted-foreground">
          Discover subdomains for target domains using DNS enumeration and brute force techniques.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Subdomain Discovery
            </CardTitle>
            <CardDescription>
              Enter a domain name to discover its subdomains and analyze their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStartScan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="font-mono"
                  disabled={scanning}
                />
                <p className="text-sm text-muted-foreground">
                  Enter domain without protocol (e.g., example.com, not https://example.com)
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Start Subdomain Scan
                  </>
                )}
              </Button>
            </form>

            {scanning && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Scanning Progress</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Enumerating subdomains using DNS queries and wordlist brute force...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {scanComplete && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Subdomain Results
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportResults}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              <CardDescription>
                Found {results.length} subdomains for {domain}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="subdomains">Subdomains</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600">Active Subdomains</p>
                      <p className="text-2xl font-bold text-green-700">{stats.active}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600">Inactive Subdomains</p>
                      <p className="text-2xl font-bold text-gray-700">{stats.inactive}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-600">Total Found</p>
                      <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="subdomains" className="space-y-4">
                  {results.length === 0 ? (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No subdomains found for {domain}. The domain might not have publicly accessible subdomains.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {results.map((subdomain, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {subdomain.status === 'active' ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <div>
                                <p className="font-mono font-medium">{subdomain.subdomain}</p>
                                <p className="text-sm text-muted-foreground">
                                  {subdomain.ip} {subdomain.httpStatus && `• HTTP ${subdomain.httpStatus}`}
                                </p>
                                {subdomain.title && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {subdomain.title}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={subdomain.status === 'active' ? 'default' : 'secondary'}>
                                {subdomain.status}
                              </Badge>
                              {subdomain.status === 'active' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`https://${subdomain.subdomain}`, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="analysis" className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Security Analysis:</strong>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Common Subdomain Patterns</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>www, api, admin</div>
                        <div>mail, ftp, blog</div>
                        <div>test, staging, dev</div>
                        <div>cdn, assets, static</div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Security Recommendations</h3>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Monitor exposed development/staging subdomains</li>
                        <li>• Ensure proper access controls on admin subdomains</li>
                        <li>• Consider implementing subdomain takeover protection</li>
                        <li>• Regular subdomain enumeration for security assessment</li>
                      </ul>
                    </Card>

                    {stats.active > 0 && (
                      <Card className="p-4">
                        <h3 className="font-semibold mb-2">Active Subdomains Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                          Found {stats.active} active subdomains. Review each for:
                        </p>
                        <ul className="text-sm space-y-1 text-muted-foreground mt-2">
                          <li>• Proper SSL/TLS configuration</li>
                          <li>• Access control and authentication</li>
                          <li>• Sensitive information exposure</li>
                          <li>• Outdated software or frameworks</li>
                        </ul>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
