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
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Mail, 
  Send, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  BarChart3,
  Users,
  FileText,
  Clock,
  TrendingUp,
  Database,
  Shield,
  Download,
  Upload,
  Trash2,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Globe,
  Zap
} from 'lucide-react';

interface EmailConfig {
  configured: boolean;
  message: string;
  supportedTypes?: string[];
}

interface EmailResult {
  success: boolean;
  message: string;
  messageId?: string;
}

interface EmailStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  recentActivity: EmailActivity[];
}

interface EmailActivity {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'delivered' | 'failed' | 'bounced';
  timestamp: string;
  messageId?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  type?: string;
  subject: string;
  description: string;
  html_content: string;
  text_content?: string;
  is_active: boolean;
  version?: number;
  created_at: string;
  updated_at: string;
  lastModified?: string;
  status?: 'active' | 'draft' | 'archived';
  usageCount?: number;
}

interface FormData {
  type: 'test' | 'welcome' | 'application-confirmation' | 'application-status' | 'password-reset' | 'notification';
  email: string;
  name: string;
  data: {
    applicationId?: string;
    status?: 'approved' | 'rejected';
    reason?: string;
    resetToken?: string;
    title?: string;
    message?: string;
  };
}

export default function EmailTestPage() {
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [isViewTemplateModalOpen, setIsViewTemplateModalOpen] = useState(false);
  const [isEditTemplateModalOpen, setIsEditTemplateModalOpen] = useState(false);
  const [templateToView, setTemplateToView] = useState<EmailTemplate | null>(null);
  const [templateToEdit, setTemplateToEdit] = useState<EmailTemplate | null>(null);
  const [dateFilter, setDateFilter] = useState('7days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newTemplateForm, setNewTemplateForm] = useState({
    name: '',
    subject: '',
    description: '',
    type: '',
    html_content: '',
    text_content: '',
    is_active: true
  });
  const [formData, setFormData] = useState<FormData>({
    type: 'test',
    email: '',
    name: '',
    data: {}
  });

  // Mock data for demonstration
  const mockStats: EmailStats = {
    totalSent: 1247,
    totalDelivered: 1198,
    totalFailed: 49,
    deliveryRate: 96.1,
    recentActivity: [
      {
        id: '1',
        type: 'welcome',
        recipient: 'user@example.com',
        subject: 'Welcome to IECA',
        status: 'delivered',
        timestamp: '2025-01-12T10:30:00Z',
        messageId: 'msg-123'
      },
      {
        id: '2',
        type: 'application-confirmation',
        recipient: 'applicant@example.com',
        subject: 'Application Confirmed',
        status: 'sent',
        timestamp: '2025-01-12T10:15:00Z',
        messageId: 'msg-124'
      },
      {
        id: '3',
        type: 'notification',
        recipient: 'member@example.com',
        subject: 'New Update Available',
        status: 'failed',
        timestamp: '2025-01-12T10:00:00Z'
      }
    ]
  };

  const mockTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Welcome Email',
      type: 'welcome',
      subject: 'Welcome to IECA Platform',
      description: 'Sent to new users upon registration',
      html_content: '<h1>Welcome to IECA Platform</h1><p>Thank you for joining us!</p>',
      text_content: 'Welcome to IECA Platform. Thank you for joining us!',
      is_active: true,
      version: 1,
      created_at: '2025-01-10T14:30:00Z',
      updated_at: '2025-01-10T14:30:00Z',
      lastModified: '2025-01-10T14:30:00Z',
      status: 'active',
      usageCount: 245
    },
    {
      id: '2',
      name: 'Application Confirmation',
      type: 'application-confirmation',
      subject: 'Your Application Has Been Received',
      description: 'Confirms receipt of membership application',
      html_content: '<h1>Application Received</h1><p>Your membership application has been received and is under review.</p>',
      text_content: 'Your membership application has been received and is under review.',
      is_active: true,
      version: 1,
      created_at: '2025-01-08T09:15:00Z',
      updated_at: '2025-01-08T09:15:00Z',
      lastModified: '2025-01-08T09:15:00Z',
      status: 'active',
      usageCount: 89
    },
    {
      id: '3',
      name: 'Password Reset',
      type: 'password-reset',
      subject: 'Reset Your Password',
      description: 'Secure password reset instructions',
      html_content: '<h1>Password Reset</h1><p>Click the link below to reset your password.</p>',
      text_content: 'Click the link below to reset your password.',
      is_active: true,
      version: 1,
      created_at: '2025-01-05T16:45:00Z',
      updated_at: '2025-01-05T16:45:00Z',
      lastModified: '2025-01-05T16:45:00Z',
      status: 'active',
      usageCount: 156
    }
  ];

  useEffect(() => {
    // Load real data from APIs
    loadEmailStats();
    loadEmailTemplates();
    loadEmailLogs();
    checkEmailConfig();
  }, [statusFilter, dateFilter]);

  const loadEmailStats = async () => {
    try {
      const response = await fetch('/api/email/dashboard/stats');
      const data = await response.json();
      if (data.success) {
        setEmailStats(data.stats);
      } else {
        console.error('Failed to load email stats:', data.error);
        // Fallback to mock data
        setEmailStats(mockStats);
      }
    } catch (error) {
      console.error('Error loading email stats:', error);
      // Fallback to mock data
      setEmailStats(mockStats);
    }
  };

  const loadEmailTemplates = async () => {
    try {
      const response = await fetch('/api/email/dashboard/templates');
      const data = await response.json();
      if (data.success) {
        setEmailTemplates(data.templates);
      } else {
        console.error('Failed to load email templates:', data.error);
        // Fallback to mock data
        setEmailTemplates(mockTemplates);
      }
    } catch (error) {
      console.error('Error loading email templates:', error);
      // Fallback to mock data
      setEmailTemplates(mockTemplates);
    }
  };

  const loadEmailLogs = async () => {
    try {
      const params = new URLSearchParams();
      params.append('limit', '10');
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (dateFilter !== 'all') {
        const days = dateFilter === '7days' ? 7 : dateFilter === '30days' ? 30 : 0;
        if (days > 0) {
          const fromDate = new Date();
          fromDate.setDate(fromDate.getDate() - days);
          params.append('dateFrom', fromDate.toISOString());
        }
      }

      const response = await fetch(`/api/email/logs?${params}`);
      const data = await response.json();
      if (data.logs) {
        setEmailLogs(data.logs);
      } else {
        console.error('Failed to load email logs:', data.error);
        setEmailLogs([]);
      }
    } catch (error) {
      console.error('Error loading email logs:', error);
      setEmailLogs([]);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch('/api/email/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTemplateForm.name,
          type: newTemplateForm.type,
          subject: newTemplateForm.subject,
          htmlContent: newTemplateForm.html_content,
          textContent: newTemplateForm.text_content,
          description: newTemplateForm.description,
          variables: []
        }),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setEmailTemplates([...emailTemplates, newTemplate]);
        setIsNewTemplateModalOpen(false);
        setNewTemplateForm({
          name: '',
          subject: '',
          description: '',
          type: '',
          html_content: '',
          text_content: '',
          is_active: true
        });
      } else {
        console.error('Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleViewTemplate = (template: EmailTemplate) => {
    setTemplateToView(template);
    setIsViewTemplateModalOpen(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setTemplateToEdit(template);
    setNewTemplateForm({
      name: template.name,
      subject: template.subject,
      description: template.description || '',
      type: template.type || '',
      html_content: template.html_content,
      text_content: template.text_content || '',
      is_active: template.is_active
    });
    setIsEditTemplateModalOpen(true);
  };

  const handleUpdateTemplate = async () => {
    if (!templateToEdit) return;

    try {
      const response = await fetch(`/api/email/templates/${templateToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTemplateForm.name,
          type: newTemplateForm.type,
          subject: newTemplateForm.subject,
          htmlContent: newTemplateForm.html_content,
          textContent: newTemplateForm.text_content,
          description: newTemplateForm.description,
          isActive: newTemplateForm.is_active,
        }),
      });

      if (response.ok) {
        const updatedTemplate = await response.json();
        setEmailTemplates(emailTemplates.map(t => 
          t.id === templateToEdit.id ? updatedTemplate : t
        ));
        setIsEditTemplateModalOpen(false);
        setTemplateToEdit(null);
        setNewTemplateForm({
          name: '',
          subject: '',
          description: '',
          type: '',
          html_content: '',
          text_content: '',
          is_active: true
        });
      } else {
        console.error('Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDeleteTemplate = async (template: EmailTemplate) => {
    if (!confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/email/templates/${template.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmailTemplates(emailTemplates.filter(t => t.id !== template.id));
      } else {
        console.error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleExportLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter !== 'all') {
        const days = dateFilter === '7days' ? 7 : dateFilter === '30days' ? 30 : 0;
        if (days > 0) {
          const fromDate = new Date();
          fromDate.setDate(fromDate.getDate() - days);
          params.append('dateFrom', fromDate.toISOString());
        }
      }
      params.append('limit', '1000'); // Export more records

      const response = await fetch(`/api/email/logs?${params}`);
      const data = await response.json();
      
      if (data.logs) {
        // Convert logs to CSV
        const csvContent = [
          ['Timestamp', 'Recipient', 'Subject', 'Status', 'Template', 'Message ID'].join(','),
          ...data.logs.map((log: any) => [
            log.createdAt,
            log.recipient,
            `"${log.subject}"`,
            log.status,
            log.template?.name || 'Manual',
            log.messageId || 'N/A'
          ].join(','))
        ].join('\n');

        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const checkEmailConfig = async () => {
    try {
      const response = await fetch('/api/email/test');
      const data = await response.json();
      setEmailConfig(data);
    } catch (error) {
      console.error('Error checking email config:', error);
    }
  };

  const sendTestEmail = async () => {
    if (!formData.email || !formData.name) {
      setResult({
        success: false,
        message: 'Please fill in email and name fields'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send email: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<FormData, 'data'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDataChange = (field: keyof FormData['data'], value: string) => {
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'bounced': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-3 w-3" />;
      case 'sent': return <Send className="h-3 w-3" />;
      case 'failed': return <AlertCircle className="h-3 w-3" />;
      case 'bounced': return <RefreshCw className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredTemplates = emailTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (template.type && template.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6 shadow-xl">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              IECA Email Dashboard
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Comprehensive email system management for user communications and analytics
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Sent</p>
                    <p className="text-3xl font-bold text-blue-400">{emailStats?.totalSent || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Send className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Delivered</p>
                    <p className="text-3xl font-bold text-green-400">{emailStats?.totalDelivered || 0}</p>
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
                    <p className="text-sm font-medium text-slate-400">Failed</p>
                    <p className="text-3xl font-bold text-red-400">{emailStats?.totalFailed || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Delivery Rate</p>
                    <p className="text-3xl font-bold text-purple-400">{emailStats?.deliveryRate || 0}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 backdrop-blur-sm border-slate-700 p-1 rounded-lg">
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="send" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300">
                <Send className="h-4 w-4" />
                Send Email
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300">
                <FileText className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300">
                <Clock className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Configuration Status */}
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      Configuration Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Button 
                        onClick={checkEmailConfig} 
                        disabled={loading}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Check Status
                      </Button>
                      {emailConfig && (
                        <Badge 
                          variant={emailConfig.configured ? 'default' : 'destructive'}
                          className={emailConfig.configured ? 
                            'bg-green-500/20 text-green-400 border-green-500' : 
                            'bg-red-500/20 text-red-400 border-red-500'
                          }
                        >
                          {emailConfig.configured ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {emailConfig.configured ? 'Online' : 'Offline'}
                        </Badge>
                      )}
                    </div>
                    {emailConfig && (
                      <Alert className={emailConfig.configured ? 
                        'border-green-500/50 bg-green-500/10 text-green-400' : 
                        'border-red-500/50 bg-red-500/10 text-red-400'
                      }>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {emailConfig.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Delivery Performance */}
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5" />
                      Delivery Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-400">Delivery Rate</span>
                        <span className="text-sm font-bold text-green-400">{emailStats?.deliveryRate || 0}%</span>
                      </div>
                      <Progress value={emailStats?.deliveryRate || 0} className="h-2 bg-slate-700" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Delivered:</span>
                          <span className="font-medium text-green-400">{emailStats?.totalDelivered || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Failed:</span>
                          <span className="font-medium text-red-400">{emailStats?.totalFailed || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    Recent Email Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {emailStats?.recentActivity?.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(activity.status)}>
                            {getStatusIcon(activity.status)}
                            <span className="ml-1 capitalize">{activity.status}</span>
                          </Badge>
                          <div>
                            <p className="font-medium text-white">{activity.subject}</p>
                            <p className="text-sm text-slate-400">{activity.recipient}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-400">{activity.type}</p>
                          <p className="text-xs text-slate-500">{formatTimestamp(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Send Email Tab */}
            <TabsContent value="send" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <Send className="h-5 w-5" />
                    Send Test Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="test@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-slate-300">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Test User"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium text-slate-300">
                      Email Type
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="test" className="text-white hover:bg-slate-600">📧 Test Email</SelectItem>
                        <SelectItem value="welcome" className="text-white hover:bg-slate-600">🎉 Welcome Email</SelectItem>
                        <SelectItem value="application-confirmation" className="text-white hover:bg-slate-600">✅ Application Confirmation</SelectItem>
                        <SelectItem value="application-status" className="text-white hover:bg-slate-600">📝 Application Status Update</SelectItem>
                        <SelectItem value="password-reset" className="text-white hover:bg-slate-600">🔒 Password Reset</SelectItem>
                        <SelectItem value="notification" className="text-white hover:bg-slate-600">🔔 Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dynamic fields based on email type */}
                  {formData.type === 'application-confirmation' && (
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <Label htmlFor="applicationId" className="text-sm font-medium text-slate-300">
                        Application ID
                      </Label>
                      <Input
                        id="applicationId"
                        placeholder="APP-123-456"
                        value={formData.data.applicationId || ''}
                        onChange={(e) => handleDataChange('applicationId', e.target.value)}
                        className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {formData.type === 'application-status' && (
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium text-slate-300">
                          Status
                        </Label>
                        <Select 
                          value={formData.data.status || 'approved'} 
                          onValueChange={(value) => handleDataChange('status', value)}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="approved" className="text-white hover:bg-slate-600">✅ Approved</SelectItem>
                            <SelectItem value="rejected" className="text-white hover:bg-slate-600">❌ Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-medium text-slate-300">
                          Reason (optional)
                        </Label>
                        <Textarea
                          id="reason"
                          placeholder="Additional notes..."
                          value={formData.data.reason || ''}
                          onChange={(e) => handleDataChange('reason', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {formData.type === 'password-reset' && (
                    <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                      <Label htmlFor="resetToken" className="text-sm font-medium text-slate-300">
                        Reset Token
                      </Label>
                      <Input
                        id="resetToken"
                        placeholder="reset-token-123"
                        value={formData.data.resetToken || ''}
                        onChange={(e) => handleDataChange('resetToken', e.target.value)}
                        className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {formData.type === 'notification' && (
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-slate-300">
                          Notification Title
                        </Label>
                        <Input
                          id="title"
                          placeholder="Important Update"
                          value={formData.data.title || ''}
                          onChange={(e) => handleDataChange('title', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium text-slate-300">
                          Notification Message
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Your notification message here..."
                          value={formData.data.message || ''}
                          onChange={(e) => handleDataChange('message', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={sendTestEmail} 
                    disabled={loading || !emailConfig?.configured}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg py-3 text-lg font-semibold"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending Email...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-3" />
                        Send Test Email
                      </>
                    )}
                  </Button>

                  {result && (
                    <Alert className={`border-2 ${result.success ? 
                      'border-green-500/50 bg-green-500/10' : 
                      'border-red-500/50 bg-red-500/10'
                    } shadow-md`}>
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      )}
                      <AlertDescription className={`text-base font-medium ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                        {result.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    Email Templates
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      />
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                    <Dialog open={isNewTemplateModalOpen} onOpenChange={setIsNewTemplateModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          <Plus className="h-4 w-4 mr-2" />
                          New Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Create New Email Template</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="template-name" className="text-slate-300">Template Name</Label>
                              <Input
                                id="template-name"
                                value={newTemplateForm.name}
                                onChange={(e) => setNewTemplateForm({...newTemplateForm, name: e.target.value})}
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder="Welcome Email"
                              />
                            </div>
                            <div>
                              <Label htmlFor="template-type" className="text-slate-300">Template Type</Label>
                              <Select value={newTemplateForm.type} onValueChange={(value) => setNewTemplateForm({...newTemplateForm, type: value})}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  <SelectItem value="welcome">Welcome</SelectItem>
                                  <SelectItem value="notification">Notification</SelectItem>
                                  <SelectItem value="application">Application</SelectItem>
                                  <SelectItem value="password-reset">Password Reset</SelectItem>
                                  <SelectItem value="newsletter">Newsletter</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="template-subject" className="text-slate-300">Email Subject</Label>
                            <Input
                              id="template-subject"
                              value={newTemplateForm.subject}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, subject: e.target.value})}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Welcome to our platform!"
                            />
                          </div>
                          <div>
                            <Label htmlFor="template-description" className="text-slate-300">Description</Label>
                            <Textarea
                              id="template-description"
                              value={newTemplateForm.description}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, description: e.target.value})}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Brief description of when this template is used..."
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor="template-html" className="text-slate-300">HTML Content</Label>
                            <Textarea
                              id="template-html"
                              value={newTemplateForm.html_content}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, html_content: e.target.value})}
                              className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                              placeholder="<html><body><h1>Welcome {{name}}!</h1><p>Thank you for joining us.</p></body></html>"
                              rows={8}
                            />
                          </div>
                          <div>
                            <Label htmlFor="template-text" className="text-slate-300">Text Content (Optional)</Label>
                            <Textarea
                              id="template-text"
                              value={newTemplateForm.text_content}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, text_content: e.target.value})}
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Welcome {{name}}! Thank you for joining us."
                              rows={4}
                            />
                          </div>
                          <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="template-active"
                                checked={newTemplateForm.is_active}
                                onChange={(e) => setNewTemplateForm({...newTemplateForm, is_active: e.target.checked})}
                                className="rounded border-slate-600 bg-slate-700"
                              />
                              <Label htmlFor="template-active" className="text-slate-300">Active Template</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsNewTemplateModalOpen(false)}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleCreateTemplate}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                disabled={!newTemplateForm.name || !newTemplateForm.subject || !newTemplateForm.html_content}
                              >
                                Create Template
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* View Template Modal */}
                    <Dialog open={isViewTemplateModalOpen} onOpenChange={setIsViewTemplateModalOpen}>
                      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">View Template: {templateToView?.name}</DialogTitle>
                        </DialogHeader>
                        {templateToView && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-slate-300">Template Name</Label>
                                <div className="p-2 bg-slate-700 rounded border border-slate-600 text-white">
                                  {templateToView.name}
                                </div>
                              </div>
                              <div>
                                <Label className="text-slate-300">Type</Label>
                                <div className="p-2 bg-slate-700 rounded border border-slate-600 text-white">
                                  {templateToView.type}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label className="text-slate-300">Subject</Label>
                              <div className="p-2 bg-slate-700 rounded border border-slate-600 text-white">
                                {templateToView.subject}
                              </div>
                            </div>
                            <div>
                              <Label className="text-slate-300">Description</Label>
                              <div className="p-2 bg-slate-700 rounded border border-slate-600 text-white">
                                {templateToView.description || 'No description'}
                              </div>
                            </div>
                            <div>
                              <Label className="text-slate-300">HTML Content</Label>
                              <div className="p-4 bg-slate-700 rounded border border-slate-600 text-white font-mono text-sm max-h-60 overflow-y-auto">
                                <pre>{templateToView.html_content}</pre>
                              </div>
                            </div>
                            {templateToView.text_content && (
                              <div>
                                <Label className="text-slate-300">Text Content</Label>
                                <div className="p-4 bg-slate-700 rounded border border-slate-600 text-white max-h-40 overflow-y-auto">
                                  {templateToView.text_content}
                                </div>
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-4">
                              <Badge variant={templateToView.is_active ? 'default' : 'secondary'}>
                                {templateToView.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                variant="outline"
                                onClick={() => setIsViewTemplateModalOpen(false)}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Edit Template Modal */}
                    <Dialog open={isEditTemplateModalOpen} onOpenChange={setIsEditTemplateModalOpen}>
                      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Edit Template: {templateToEdit?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-template-name" className="text-slate-300">Template Name</Label>
                              <Input
                                id="edit-template-name"
                                value={newTemplateForm.name}
                                onChange={(e) => setNewTemplateForm({...newTemplateForm, name: e.target.value})}
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-template-type" className="text-slate-300">Template Type</Label>
                              <Select value={newTemplateForm.type} onValueChange={(value) => setNewTemplateForm({...newTemplateForm, type: value})}>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  <SelectItem value="welcome">Welcome</SelectItem>
                                  <SelectItem value="notification">Notification</SelectItem>
                                  <SelectItem value="application">Application</SelectItem>
                                  <SelectItem value="password-reset">Password Reset</SelectItem>
                                  <SelectItem value="newsletter">Newsletter</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-template-subject" className="text-slate-300">Email Subject</Label>
                            <Input
                              id="edit-template-subject"
                              value={newTemplateForm.subject}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, subject: e.target.value})}
                              className="bg-slate-700 border-slate-600 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-template-description" className="text-slate-300">Description</Label>
                            <Textarea
                              id="edit-template-description"
                              value={newTemplateForm.description}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, description: e.target.value})}
                              className="bg-slate-700 border-slate-600 text-white"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-template-html" className="text-slate-300">HTML Content</Label>
                            <Textarea
                              id="edit-template-html"
                              value={newTemplateForm.html_content}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, html_content: e.target.value})}
                              className="bg-slate-700 border-slate-600 text-white font-mono text-sm"
                              rows={8}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-template-text" className="text-slate-300">Text Content</Label>
                            <Textarea
                              id="edit-template-text"
                              value={newTemplateForm.text_content}
                              onChange={(e) => setNewTemplateForm({...newTemplateForm, text_content: e.target.value})}
                              className="bg-slate-700 border-slate-600 text-white"
                              rows={4}
                            />
                          </div>
                          <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="edit-template-active"
                                checked={newTemplateForm.is_active}
                                onChange={(e) => setNewTemplateForm({...newTemplateForm, is_active: e.target.checked})}
                                className="rounded border-slate-600 bg-slate-700"
                              />
                              <Label htmlFor="edit-template-active" className="text-slate-300">Active Template</Label>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsEditTemplateModalOpen(false)}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleUpdateTemplate}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                disabled={!newTemplateForm.name || !newTemplateForm.subject || !newTemplateForm.html_content}
                              >
                                Update Template
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4">
                    {filteredTemplates.map((template) => (
                      <Card key={template.id} className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{template.name}</h3>
                                <p className="text-sm text-slate-400">{template.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                    {template.type || 'General'}
                                  </Badge>
                                  <span className="text-xs text-slate-500">
                                    Subject: {template.subject}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    Version: {template.version || 1}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    Modified: {template.updated_at ? new Date(template.updated_at).toLocaleDateString() : 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={template.is_active ? 'default' : 'secondary'}
                                className={template.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-slate-300'}
                              >
                                {template.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-slate-400 hover:text-white"
                                onClick={() => handleViewTemplate(template)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-slate-400 hover:text-white"
                                onClick={() => handleEditTemplate(template)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-slate-400 hover:text-red-400"
                                onClick={() => handleDeleteTemplate(template)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    Email Activity Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                          <Calendar className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="7days">Last 7 days</SelectItem>
                          <SelectItem value="30days">Last 30 days</SelectItem>
                          <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="SENT">Sent</SelectItem>
                          <SelectItem value="FAILED">Failed</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={handleExportLogs}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="rounded-lg border border-slate-700 bg-slate-800/50">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700 hover:bg-slate-700/50">
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300">Type</TableHead>
                          <TableHead className="text-slate-300">Recipient</TableHead>
                          <TableHead className="text-slate-300">Subject</TableHead>
                          <TableHead className="text-slate-300">Timestamp</TableHead>
                          <TableHead className="text-slate-300">Message ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emailLogs && emailLogs.length > 0 ? (
                          emailLogs.map((log) => (
                            <TableRow key={log.id} className="border-slate-700 hover:bg-slate-700/30">
                              <TableCell>                              <Badge className={getStatusColor(log.status.toLowerCase())}>
                                {getStatusIcon(log.status.toLowerCase())}
                                <span className="ml-1 capitalize">{log.status?.toLowerCase()}</span>
                              </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-blue-400">{log.template?.name || 'Manual'}</TableCell>
                              <TableCell className="text-slate-300">{log.recipient}</TableCell>
                              <TableCell className="text-slate-300">{log.subject}</TableCell>
                              <TableCell className="text-sm text-slate-400">
                                {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                              </TableCell>
                              <TableCell className="text-sm font-mono text-slate-500">
                                {log.messageId || 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                              No email logs found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      SMTP Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <div className="flex items-center gap-3 mb-3">
                          <Globe className="h-5 w-5 text-blue-400" />
                          <h4 className="font-semibold text-white">Server Settings</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">SMTP Host:</span>
                            <span className="font-medium text-white">smtp.gmail.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Port:</span>
                            <span className="font-medium text-white">587</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Security:</span>
                            <span className="font-medium text-white">TLS</span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Configure SMTP
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3">
                      <Shield className="h-5 w-5" />
                      Security & Limits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                        <div className="flex items-center gap-3 mb-3">
                          <Zap className="h-5 w-5 text-green-400" />
                          <h4 className="font-semibold text-white">Rate Limits</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Daily Limit:</span>
                            <span className="font-medium text-white">1,000 emails</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Hourly Limit:</span>
                            <span className="font-medium text-white">100 emails</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Today's Usage:</span>
                            <span className="font-medium text-white">247 emails</span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Limits
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
