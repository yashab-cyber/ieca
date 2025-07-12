'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Globe, 
  Search, 
  Lock, 
  Eye, 
  Zap, 
  AlertTriangle,
  Server,
  Hash,
  Network,
  FileSearch,
  Link,
  ShieldCheck,
  Bug,
  Scan,
  Activity,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface SecurityTool {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: any;
  color: string;
  isActive: boolean;
  usageCount?: number;
  lastUsed?: string;
}

interface SecurityStats {
  totalTools: number;
  activeScans: number;
  completedScans: number;
  vulnerabilitiesFound: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  action: string;
  tool: string;
  status: 'completed' | 'failed' | 'pending';
  timestamp: string;
}

export default function SecurityToolsPage() {
  const [stats, setStats] = useState<SecurityStats>({
    totalTools: 0,
    activeScans: 0,
    completedScans: 0,
    vulnerabilitiesFound: 0,
    recentActivity: []
  });

  const [tools, setTools] = useState<SecurityTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load security tools data on component mount
  useEffect(() => {
    loadSecurityToolsData();
  }, []);

  const loadSecurityToolsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/security/tools');
      const data = await response.json();

      if (data.success) {
        // Map the database tools to include the required UI properties
        const formattedTools = data.tools.map((tool: any) => ({
          ...tool,
          icon: getToolIcon(tool.type),
          color: getToolColor(tool.type)
        }));

        setTools(formattedTools);
        setStats(data.stats);
      } else {
        setError(data.message || 'Failed to load security tools');
      }
    } catch (err) {
      console.error('Error loading security tools:', err);
      setError('Failed to load security tools data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get tool icon based on type
  const getToolIcon = (type: string) => {
    switch (type) {
      case 'IP_LOGGER': return Globe;
      case 'PORT_SCANNER': return Server;
      case 'VULNERABILITY_SCANNER': return Bug;
      case 'HASH_CRACKER': return Hash;
      case 'SUBDOMAIN_FINDER': return Search;
      case 'DNS_LOOKUP': return Network;
      case 'WHOIS_LOOKUP': return FileSearch;
      case 'SSL_CHECKER': return Lock;
      case 'HEADER_ANALYZER': return Scan;
      case 'URL_EXPANDER': return Link;
      case 'PHISHING_DETECTOR': return Eye;
      case 'MALWARE_SCANNER': return ShieldCheck;
      default: return Shield;
    }
  };

  // Helper function to get tool color based on type
  const getToolColor = (type: string) => {
    switch (type) {
      case 'IP_LOGGER': return 'bg-blue-500';
      case 'PORT_SCANNER': return 'bg-green-500';
      case 'VULNERABILITY_SCANNER': return 'bg-red-500';
      case 'HASH_CRACKER': return 'bg-purple-500';
      case 'SUBDOMAIN_FINDER': return 'bg-orange-500';
      case 'DNS_LOOKUP': return 'bg-cyan-500';
      case 'WHOIS_LOOKUP': return 'bg-indigo-500';
      case 'SSL_CHECKER': return 'bg-emerald-500';
      case 'HEADER_ANALYZER': return 'bg-pink-500';
      case 'URL_EXPANDER': return 'bg-yellow-500';
      case 'PHISHING_DETECTOR': return 'bg-rose-500';
      case 'MALWARE_SCANNER': return 'bg-violet-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading security tools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6 shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Security Tools Portal
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Comprehensive cybersecurity toolkit for penetration testing, vulnerability assessment, and security research
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Tools</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.totalTools}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Active Scans</p>
                    <p className="text-3xl font-bold text-yellow-400">{stats.activeScans}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Completed</p>
                    <p className="text-3xl font-bold text-green-400">{stats.completedScans}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Vulnerabilities</p>
                    <p className="text-3xl font-bold text-red-400">{stats.vulnerabilitiesFound}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="tools" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm border-slate-700 p-1 rounded-lg">
              <TabsTrigger value="tools" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-slate-300">
                <Shield className="h-4 w-4" />
                Security Tools
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-slate-300">
                <Activity className="h-4 w-4" />
                Recent Activity
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-slate-300">
                <Bug className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            {/* Security Tools Tab */}
            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Card key={tool.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl hover:shadow-red-500/20 transition-all duration-300 group cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 ${tool.color}/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className={`h-6 w-6 text-white`} />
                          </div>
                          <Badge 
                            variant={tool.isActive ? 'default' : 'secondary'}
                            className={tool.isActive ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50'}
                          >
                            {tool.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-white group-hover:text-red-400 transition-colors duration-300">
                          {tool.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Users className="h-4 w-4" />
                            <span>{tool.usageCount} uses</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="h-4 w-4" />
                            <span>{tool.lastUsed}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg"
                          onClick={() => window.location.href = `/portal/security/${tool.type.toLowerCase().replace('_', '-')}`}
                        >
                          Launch Tool
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Recent Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <Activity className="h-5 w-5" />
                    Recent Security Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(activity.status)}
                          <div>
                            <p className="font-medium text-white">{activity.action}</p>
                            <p className="text-sm text-slate-400">{activity.tool}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <Bug className="h-5 w-5" />
                    Vulnerability Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Bug className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Reports Yet</h3>
                    <p className="text-slate-400 mb-6">
                      Start using security tools to generate vulnerability reports and security assessments.
                    </p>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Run Your First Scan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
