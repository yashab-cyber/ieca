'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Globe, 
  Copy, 
  Eye, 
  MapPin, 
  Clock, 
  Smartphone, 
  Monitor, 
  Wifi,
  Shield,
  Download,
  Trash2,
  Plus,
  ExternalLink,
  Activity,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Share2
} from 'lucide-react';

interface IPLogSession {
  id: string;
  name: string;
  description: string;
  trackingUrl: string;
  redirectUrl: string;
  isActive: boolean;
  clickCount: number;
  uniqueIPs: number;
  createdAt: string;
  expiresAt?: string;
}

interface IPLogEntry {
  id: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  country: string;
  city: string;
  region: string;
  timezone: string;
  isp: string;
  device: string;
  browser: string;
  os: string;
  referer?: string;
  clickedAt: string;
}

export default function IPLoggerPage() {
  const [sessions, setSessions] = useState<IPLogSession[]>([
    {
      id: '1',
      name: 'Social Media Campaign',
      description: 'Tracking clicks from social media posts',
      trackingUrl: 'https://track.ieca.dev/s/abc123',
      redirectUrl: 'https://example.com',
      isActive: true,
      clickCount: 47,
      uniqueIPs: 32,
      createdAt: '2025-01-12T10:00:00Z',
      expiresAt: '2025-01-19T10:00:00Z'
    },
    {
      id: '2',
      name: 'Email Campaign',
      description: 'Newsletter click tracking',
      trackingUrl: 'https://track.ieca.dev/s/def456',
      redirectUrl: 'https://newsletter.example.com',
      isActive: true,
      clickCount: 123,
      uniqueIPs: 89,
      createdAt: '2025-01-10T14:30:00Z'
    }
  ]);

  const [logs, setLogs] = useState<IPLogEntry[]>([]);

  useEffect(() => {
    loadSessions();
    loadLogs();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/security/ip-logger/sessions?userId=user1');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const response = await fetch('/api/security/ip-logger/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const [newSession, setNewSession] = useState({
    name: '',
    description: '',
    redirectUrl: '',
    expiresIn: '7', // days
    trackingEnabled: true
  });

  const [selectedSession, setSelectedSession] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');

  const createSession = async () => {
    if (!newSession.name || !newSession.redirectUrl) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/security/ip-logger/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSession.name,
          description: newSession.description,
          redirectUrl: newSession.redirectUrl,
          expiresIn: parseInt(newSession.expiresIn)
        })
      });

      if (response.ok) {
        const session = await response.json();
        setSessions([session, ...sessions]);
        setIsCreateModalOpen(false);
        setNewSession({
          name: '',
          description: '',
          redirectUrl: '',
          expiresIn: '7',
          trackingEnabled: true
        });
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const response = await fetch(`/api/security/ip-logger/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
        setLogs(logs.filter(l => l.sessionId !== sessionId));
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const toggleSession = async (sessionId: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;

      const response = await fetch(`/api/security/ip-logger/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !session.isActive })
      });

      if (response.ok) {
        setSessions(sessions.map(s => 
          s.id === sessionId ? { ...s, isActive: !s.isActive } : s
        ));
      }
    } catch (error) {
      console.error('Error toggling session:', error);
    }
  };

  const exportLogs = () => {
    const filteredLogs = logs.filter(log => 
      selectedSession ? log.sessionId === selectedSession : true
    );

    const csvContent = [
      ['Session', 'IP Address', 'Country', 'City', 'ISP', 'Device', 'Browser', 'OS', 'Referer', 'Timestamp'].join(','),
      ...filteredLogs.map(log => [
        sessions.find(s => s.id === log.sessionId)?.name || '',
        log.ipAddress,
        log.country,
        log.city,
        log.isp,
        log.device,
        log.browser,
        log.os,
        log.referer || '',
        log.clickedAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.ipAddress.includes(searchTerm) ||
      log.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = filterCountry === 'all' || log.country === filterCountry;
    const matchesSession = selectedSession === '' || log.sessionId === selectedSession;
    
    return matchesSearch && matchesCountry && matchesSession;
  });

  const countries = [...new Set(logs.map(log => log.country))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 shadow-xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">IP Logger</h1>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Generate tracking links to capture visitor IP addresses, location data, and device information
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Active Sessions</p>
                    <p className="text-3xl font-bold text-blue-400">
                      {sessions.filter(s => s.isActive).length}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Clicks</p>
                    <p className="text-3xl font-bold text-green-400">
                      {sessions.reduce((acc, s) => acc + s.clickCount, 0)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Unique IPs</p>
                    <p className="text-3xl font-bold text-purple-400">
                      {sessions.reduce((acc, s) => acc + s.uniqueIPs, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Countries</p>
                    <p className="text-3xl font-bold text-orange-400">{countries.length}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sessions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <TabsTrigger value="sessions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Tracking Sessions
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                IP Logs
              </TabsTrigger>
            </TabsList>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Tracking Sessions</h2>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New Tracking Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="session-name" className="text-slate-300">Session Name</Label>
                        <Input
                          id="session-name"
                          value={newSession.name}
                          onChange={(e) => setNewSession({...newSession, name: e.target.value})}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="e.g., Social Media Campaign"
                        />
                      </div>
                      <div>
                        <Label htmlFor="session-description" className="text-slate-300">Description</Label>
                        <Textarea
                          id="session-description"
                          value={newSession.description}
                          onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Optional description..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="redirect-url" className="text-slate-300">Redirect URL</Label>
                        <Input
                          id="redirect-url"
                          value={newSession.redirectUrl}
                          onChange={(e) => setNewSession({...newSession, redirectUrl: e.target.value})}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expires-in" className="text-slate-300">Expires In</Label>
                        <Select value={newSession.expiresIn} onValueChange={(value) => setNewSession({...newSession, expiresIn: value})}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="1">1 Day</SelectItem>
                            <SelectItem value="7">7 Days</SelectItem>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                            <SelectItem value="0">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateModalOpen(false)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={createSession}
                          disabled={isLoading || !newSession.name || !newSession.redirectUrl}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        >
                          {isLoading ? 'Creating...' : 'Create Session'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6">
                {sessions.map((session) => (
                  <Card key={session.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            {session.name}
                            <Badge variant={session.isActive ? 'default' : 'secondary'}>
                              {session.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </CardTitle>
                          <p className="text-slate-400 mt-1">{session.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSession(session.id)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            {session.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSession(session.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-sm text-slate-400">Clicks</p>
                          <p className="text-2xl font-bold text-white">{session.clickCount}</p>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-sm text-slate-400">Unique IPs</p>
                          <p className="text-2xl font-bold text-white">{session.uniqueIPs}</p>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-sm text-slate-400">Created</p>
                          <p className="text-sm font-medium text-white">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-slate-300">Tracking URL</Label>
                        <div className="flex gap-2">
                          <Input
                            value={session.trackingUrl}
                            readOnly
                            className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(session.trackingUrl)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(session.trackingUrl, '_blank')}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Redirect URL</Label>
                        <Input
                          value={session.redirectUrl}
                          readOnly
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">IP Access Logs</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportLogs}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by IP, country, or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <Select value={filterCountry} onValueChange={setFilterCountry}>
                      <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Filter by country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all">All Countries</SelectItem>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedSession} onValueChange={setSelectedSession}>
                      <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="All sessions" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="">All Sessions</SelectItem>
                        {sessions.map(session => (
                          <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-lg border border-slate-700 bg-slate-800/50">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          <TableHead className="text-slate-300">IP Address</TableHead>
                          <TableHead className="text-slate-300">Location</TableHead>
                          <TableHead className="text-slate-300">ISP</TableHead>
                          <TableHead className="text-slate-300">Device</TableHead>
                          <TableHead className="text-slate-300">Browser</TableHead>
                          <TableHead className="text-slate-300">Referer</TableHead>
                          <TableHead className="text-slate-300">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map((log) => (
                          <TableRow key={log.id} className="border-slate-700 hover:bg-slate-700/30">
                            <TableCell className="font-mono text-blue-400">{log.ipAddress}</TableCell>
                            <TableCell className="text-slate-300">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-orange-400" />
                                {log.city}, {log.country}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">{log.isp}</TableCell>
                            <TableCell className="text-slate-300">
                              <div className="flex items-center gap-1">
                                {log.device === 'Mobile' ? 
                                  <Smartphone className="h-3 w-3 text-green-400" /> : 
                                  <Monitor className="h-3 w-3 text-blue-400" />
                                }
                                {log.device}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">{log.browser}</TableCell>
                            <TableCell className="text-slate-300 max-w-32 truncate">
                              {log.referer || 'Direct'}
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm">
                              {new Date(log.clickedAt).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
