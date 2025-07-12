'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Server, 
  Play, 
  StopCircle, 
  Download, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Wifi,
  Globe,
  ArrowLeft
} from 'lucide-react';

interface PortScanResult {
  port: number;
  protocol: string;
  status: 'open' | 'closed' | 'filtered';
  service?: string;
  version?: string;
  banner?: string;
}

interface ScanSession {
  id: string;
  target: string;
  scanType: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  startTime: string;
  endTime?: string;
  results: PortScanResult[];
  error?: string;
}

export default function PortScannerPage() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('common');
  const [customPorts, setCustomPorts] = useState('');
  const [currentScan, setCurrentScan] = useState<ScanSession | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanSession[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    if (!target) return;

    const session: ScanSession = {
      id: `scan_${Date.now()}`,
      target,
      scanType,
      status: 'pending',
      progress: 0,
      startTime: new Date().toISOString(),
      results: []
    };

    setCurrentScan(session);
    setIsScanning(true);

    try {
      const response = await fetch('/api/security/port-scanner/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          scanType,
          customPorts: customPorts || undefined
        })
      });

      if (response.ok) {
        // Start polling for results
        pollScanResults(session.id);
      } else {
        setCurrentScan({
          ...session,
          status: 'error',
          error: 'Failed to start scan'
        });
        setIsScanning(false);
      }
    } catch (error) {
      setCurrentScan({
        ...session,
        status: 'error',
        error: 'Network error'
      });
      setIsScanning(false);
    }
  };

  const pollScanResults = async (scanId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/security/port-scanner/scan/${scanId}`);
        const data = await response.json();

        if (data.status === 'completed' || data.status === 'error') {
          clearInterval(pollInterval);
          setIsScanning(false);
          setScanHistory(prev => [...prev, data]);
        }

        setCurrentScan(data);
      } catch (error) {
        clearInterval(pollInterval);
        setIsScanning(false);
      }
    }, 2000);
  };

  const stopScan = async () => {
    if (currentScan) {
      try {
        await fetch(`/api/security/port-scanner/scan/${currentScan.id}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error stopping scan:', error);
      }
    }
    setIsScanning(false);
    setCurrentScan(null);
  };

  const exportResults = () => {
    if (!currentScan || !currentScan.results.length) return;

    const csvContent = [
      ['Port', 'Protocol', 'Status', 'Service', 'Version', 'Banner'].join(','),
      ...currentScan.results.map(result => [
        result.port,
        result.protocol,
        result.status,
        result.service || '',
        result.version || '',
        result.banner || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `port-scan-${currentScan.target}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'filtered':
        return <Shield className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'closed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'filtered':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const openPorts = currentScan?.results.filter(r => r.status === 'open') || [];
  const closedPorts = currentScan?.results.filter(r => r.status === 'closed') || [];
  const filteredPorts = currentScan?.results.filter(r => r.status === 'filtered') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Port Scanner</h1>
              </div>
              <p className="text-blue-200">
                Scan open ports on target systems to identify running services
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scan Configuration */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Scan Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="target" className="text-slate-300">Target Host</Label>
                    <Input
                      id="target"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="example.com or 192.168.1.1"
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={isScanning}
                    />
                  </div>

                  <div>
                    <Label htmlFor="scan-type" className="text-slate-300">Scan Type</Label>
                    <Select value={scanType} onValueChange={setScanType} disabled={isScanning}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="common">Common Ports (Top 1000)</SelectItem>
                        <SelectItem value="all">All Ports (1-65535)</SelectItem>
                        <SelectItem value="well-known">Well-Known Ports (1-1023)</SelectItem>
                        <SelectItem value="custom">Custom Ports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {scanType === 'custom' && (
                    <div>
                      <Label htmlFor="custom-ports" className="text-slate-300">Custom Ports</Label>
                      <Input
                        id="custom-ports"
                        value={customPorts}
                        onChange={(e) => setCustomPorts(e.target.value)}
                        placeholder="22,80,443,8080-8090"
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={isScanning}
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Comma-separated ports or ranges (e.g., 80,443,8000-9000)
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!isScanning ? (
                      <Button
                        onClick={startScan}
                        disabled={!target}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Scan
                      </Button>
                    ) : (
                      <Button
                        onClick={stopScan}
                        variant="outline"
                        className="flex-1 border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        Stop Scan
                      </Button>
                    )}
                  </div>

                  {currentScan && (
                    <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Progress</span>
                        <Badge className={
                          currentScan.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          currentScan.status === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }>
                          {currentScan.status}
                        </Badge>
                      </div>
                      <Progress value={currentScan.progress} className="h-2" />
                      <div className="text-xs text-slate-400">
                        Target: {currentScan.target}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Summary */}
              {currentScan && currentScan.results.length > 0 && (
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 mt-6">
                  <CardHeader>
                    <CardTitle className="text-white">Scan Results Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                        <div className="text-2xl font-bold text-green-400">{openPorts.length}</div>
                        <div className="text-xs text-slate-300">Open</div>
                      </div>
                      <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                        <div className="text-2xl font-bold text-red-400">{closedPorts.length}</div>
                        <div className="text-xs text-slate-300">Closed</div>
                      </div>
                      <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                        <div className="text-2xl font-bold text-yellow-400">{filteredPorts.length}</div>
                        <div className="text-xs text-slate-300">Filtered</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Scan Results</CardTitle>
                    {currentScan && currentScan.results.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportResults}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!currentScan ? (
                    <div className="text-center py-12">
                      <Server className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Scan Running</h3>
                      <p className="text-slate-400">
                        Configure your scan parameters and click "Start Scan" to begin
                      </p>
                    </div>
                  ) : currentScan.results.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="animate-pulse">
                        <Wifi className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Scanning...</h3>
                      <p className="text-slate-400">
                        Checking ports on {currentScan.target}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-slate-700 bg-slate-800/50">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700">
                            <TableHead className="text-slate-300">Port</TableHead>
                            <TableHead className="text-slate-300">Protocol</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">Service</TableHead>
                            <TableHead className="text-slate-300">Version</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentScan.results.map((result, index) => (
                            <TableRow key={index} className="border-slate-700 hover:bg-slate-700/30">
                              <TableCell className="font-mono text-blue-400">{result.port}</TableCell>
                              <TableCell className="text-slate-300">{result.protocol.toUpperCase()}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(result.status)}>
                                  {getStatusIcon(result.status)}
                                  <span className="ml-1 capitalize">{result.status}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-300">{result.service || '-'}</TableCell>
                              <TableCell className="text-slate-300 max-w-32 truncate">
                                {result.version || '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Error Display */}
              {currentScan?.status === 'error' && currentScan.error && (
                <Alert className="mt-6 border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    Scan Error: {currentScan.error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
