'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Hash, 
  Play, 
  StopCircle, 
  Download, 
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  Shield,
  ArrowLeft,
  FileText,
  Zap
} from 'lucide-react';

interface HashCrackSession {
  id: string;
  hash: string;
  hashType: string;
  method: 'dictionary' | 'brute-force' | 'hybrid';
  status: 'pending' | 'cracking' | 'cracked' | 'failed' | 'timeout';
  progress: number;
  startTime: string;
  endTime?: string;
  result?: string;
  attempts: number;
  error?: string;
}

export default function HashCrackerPage() {
  const [hash, setHash] = useState('');
  const [hashType, setHashType] = useState('MD5');
  const [method, setMethod] = useState<'dictionary' | 'brute-force' | 'hybrid'>('dictionary');
  const [customDict, setCustomDict] = useState('');
  const [currentSession, setCurrentSession] = useState<HashCrackSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<HashCrackSession[]>([]);
  const [isCracking, setIsCracking] = useState(false);

  const hashExamples = {
    MD5: '5d41402abc4b2a76b9719d911017c592',
    SHA1: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
    SHA256: '2cf24dba4f21d4288094e5343bd5b40de0e4e999ca4f0a688b6b3daa8b84c1ce',
    SHA512: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
    BCRYPT: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.dq0FFocmy',
    NTLM: 'b4b9b02e6f09a9bd760f388b67351e2b'
  };

  const dictionaries = [
    { name: 'Common Passwords', size: '10K', description: 'Most common passwords' },
    { name: 'RockYou', size: '14M', description: 'Popular leaked password list' },
    { name: 'SecLists', size: '1.5M', description: 'Security-focused wordlist' },
    { name: 'Custom', size: 'Variable', description: 'Upload your own wordlist' }
  ];

  const startCracking = async () => {
    if (!hash || !hashType) return;

    const session: HashCrackSession = {
      id: `crack_${Date.now()}`,
      hash,
      hashType,
      method,
      status: 'cracking',
      progress: 0,
      startTime: new Date().toISOString(),
      attempts: 0
    };

    setCurrentSession(session);
    setIsCracking(true);

    try {
      const response = await fetch('/api/security/hash-cracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash,
          hashType: hashType.toLowerCase(),
          attackType: method === 'brute-force' ? 'bruteforce' : method,
          charset: 'all',
          maxLength: 4
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.result) {
          const finalSession: HashCrackSession = {
            ...session,
            status: data.result.status === 'cracked' ? 'cracked' : 'failed',
            progress: 100,
            endTime: new Date().toISOString(),
            result: data.result.plaintext,
            attempts: data.result.attempts
          };
          setCurrentSession(finalSession);
          setSessionHistory(prev => [...prev, finalSession]);
          setIsCracking(false);
        } else {
          setCurrentSession({
            ...session,
            status: 'failed',
            error: 'Hash could not be cracked'
          });
          setIsCracking(false);
        }
      } else {
        setCurrentSession({
          ...session,
          status: 'failed',
          error: 'Failed to start cracking session'
        });
        setIsCracking(false);
      }
    } catch (error) {
      setCurrentSession({
        ...session,
        status: 'failed',
        error: 'Network error'
      });
      setIsCracking(false);
    }
  };

  const stopCracking = async () => {
    setIsCracking(false);
    setCurrentSession(null);
  };

  const detectHashType = (inputHash: string) => {
    const trimmedHash = inputHash.trim();
    
    if (trimmedHash.length === 32 && /^[a-f0-9]+$/i.test(trimmedHash)) {
      return 'MD5';
    } else if (trimmedHash.length === 40 && /^[a-f0-9]+$/i.test(trimmedHash)) {
      return 'SHA1';
    } else if (trimmedHash.length === 64 && /^[a-f0-9]+$/i.test(trimmedHash)) {
      return 'SHA256';
    } else if (trimmedHash.length === 128 && /^[a-f0-9]+$/i.test(trimmedHash)) {
      return 'SHA512';
    } else if (trimmedHash.startsWith('$2b$') || trimmedHash.startsWith('$2a$') || trimmedHash.startsWith('$2y$')) {
      return 'BCRYPT';
    } else if (trimmedHash.length === 32 && /^[a-f0-9]+$/i.test(trimmedHash)) {
      return 'NTLM';
    }
    
    return 'MD5'; // Default fallback
  };

  const handleHashChange = (value: string) => {
    setHash(value);
    if (value.trim()) {
      const detectedType = detectHashType(value);
      setHashType(detectedType);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cracked':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
      case 'timeout':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'cracking':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cracked':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
      case 'timeout':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'cracking':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const duration = endTime.getTime() - startTime.getTime();
    
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

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
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Hash className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">Hash Cracker</h1>
              </div>
              <p className="text-blue-200">
                Decrypt various hash formats using dictionary and brute force attacks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Crack Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hash-input" className="text-slate-300">Hash Value</Label>
                    <Textarea
                      id="hash-input"
                      value={hash}
                      onChange={(e) => handleHashChange(e.target.value)}
                      placeholder="Enter hash to crack..."
                      className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                      rows={3}
                      disabled={isCracking}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hash-type" className="text-slate-300">Hash Type</Label>
                    <Select value={hashType} onValueChange={setHashType} disabled={isCracking}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="MD5">MD5</SelectItem>
                        <SelectItem value="SHA1">SHA-1</SelectItem>
                        <SelectItem value="SHA256">SHA-256</SelectItem>
                        <SelectItem value="SHA512">SHA-512</SelectItem>
                        <SelectItem value="BCRYPT">bcrypt</SelectItem>
                        <SelectItem value="NTLM">NTLM</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400 mt-1">
                      Auto-detected based on hash length and format
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="method" className="text-slate-300">Attack Method</Label>
                    <Select 
                      value={method} 
                      onValueChange={(value) => setMethod(value as 'dictionary' | 'brute-force' | 'hybrid')} 
                      disabled={isCracking}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="dictionary">Dictionary Attack</SelectItem>
                        <SelectItem value="brute-force">Brute Force</SelectItem>
                        <SelectItem value="hybrid">Hybrid Attack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {method === 'dictionary' && (
                    <div>
                      <Label className="text-slate-300">Dictionary</Label>
                      <div className="space-y-2">
                        {dictionaries.map((dict) => (
                          <div key={dict.name} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-white">{dict.name}</p>
                                <p className="text-xs text-slate-400">{dict.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {dict.size}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {method === 'brute-force' && (
                    <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        <span className="text-sm font-medium text-orange-400">Brute Force Warning</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Brute force attacks can take a very long time for complex passwords. 
                        Consider using dictionary attacks first.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!isCracking ? (
                      <Button
                        onClick={startCracking}
                        disabled={!hash}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Cracking
                      </Button>
                    ) : (
                      <Button
                        onClick={stopCracking}
                        variant="outline"
                        className="flex-1 border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        Stop Cracking
                      </Button>
                    )}
                  </div>

                  {currentSession && (
                    <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Progress</span>
                        <Badge className={getStatusColor(currentSession.status)}>
                          {getStatusIcon(currentSession.status)}
                          <span className="ml-1 capitalize">{currentSession.status}</span>
                        </Badge>
                      </div>
                      <Progress value={currentSession.progress} className="h-2" />
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>Hash Type: {currentSession.hashType}</div>
                        <div>Method: {currentSession.method}</div>
                        <div>Attempts: {currentSession.attempts.toLocaleString()}</div>
                        <div>Duration: {formatDuration(currentSession.startTime, currentSession.endTime)}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hash Examples */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 mt-6">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Hash Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(hashExamples).map(([type, example]) => (
                    <div key={type} className="p-2 bg-slate-700/30 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-slate-300">{type}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setHash(example);
                            setHashType(type);
                          }}
                          className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
                        >
                          Use
                        </Button>
                      </div>
                      <div className="text-xs font-mono text-slate-400 break-all">
                        {example.slice(0, 30)}...
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Cracking Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {!currentSession ? (
                    <div className="text-center py-12">
                      <Hash className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Active Session</h3>
                      <p className="text-slate-400">
                        Enter a hash and start cracking to see results here
                      </p>
                    </div>
                  ) : currentSession.status === 'cracked' && currentSession.result ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-green-500/10 rounded-lg border border-green-500/30">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle className="h-8 w-8 text-green-400" />
                          <div>
                            <h3 className="text-xl font-bold text-green-400">Hash Cracked!</h3>
                            <p className="text-slate-300">Password successfully recovered</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-slate-300">Original Hash</Label>
                            <div className="p-3 bg-slate-700 rounded font-mono text-sm text-slate-300 break-all">
                              {currentSession.hash}
                            </div>
                          </div>
                          <div>
                            <Label className="text-slate-300">Cracked Password</Label>
                            <div className="p-3 bg-green-500/20 rounded font-mono text-lg text-green-400 border border-green-500/50">
                              {currentSession.result}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Hash Type:</span>
                              <span className="ml-2 text-white">{currentSession.hashType}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Method:</span>
                              <span className="ml-2 text-white">{currentSession.method}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Attempts:</span>
                              <span className="ml-2 text-white">{currentSession.attempts.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Duration:</span>
                              <span className="ml-2 text-white">
                                {formatDuration(currentSession.startTime, currentSession.endTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : currentSession.status === 'failed' || currentSession.status === 'timeout' ? (
                    <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/30">
                      <div className="flex items-center gap-3 mb-4">
                        <XCircle className="h-8 w-8 text-red-400" />
                        <div>
                          <h3 className="text-xl font-bold text-red-400">
                            {currentSession.status === 'timeout' ? 'Timeout' : 'Failed'}
                          </h3>
                          <p className="text-slate-300">
                            {currentSession.status === 'timeout' 
                              ? 'Cracking session timed out'
                              : 'Unable to crack the hash'
                            }
                          </p>
                        </div>
                      </div>
                      {currentSession.error && (
                        <div className="mt-4 p-3 bg-slate-700 rounded">
                          <p className="text-sm text-slate-300">{currentSession.error}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="animate-pulse">
                        <Zap className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Cracking in Progress...</h3>
                      <p className="text-slate-400 mb-4">
                        Attempting to crack {currentSession.hashType} hash using {currentSession.method}
                      </p>
                      <div className="max-w-md mx-auto">
                        <Progress value={currentSession.progress} className="h-3" />
                        <p className="text-sm text-slate-400 mt-2">
                          {currentSession.attempts.toLocaleString()} attempts made
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Session History */}
              {sessionHistory.length > 0 && (
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 mt-6">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sessionHistory.slice(0, 5).map((session) => (
                        <div key={session.id} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getStatusColor(session.status)}>
                                  {getStatusIcon(session.status)}
                                  <span className="ml-1 capitalize">{session.status}</span>
                                </Badge>
                                <span className="text-sm text-slate-300">{session.hashType}</span>
                              </div>
                              <div className="text-xs font-mono text-slate-400 break-all mb-1">
                                {session.hash.slice(0, 40)}...
                              </div>
                              {session.result && (
                                <div className="text-sm text-green-400 font-medium">
                                  Password: {session.result}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 text-right">
                              {formatDuration(session.startTime, session.endTime)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
