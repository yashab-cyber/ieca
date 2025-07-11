'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Download, 
  Shield, 
  Activity,
  AlertTriangle,
  Mail,
  BookOpen,
  Database,
  Clock,
  UserCheck,
  UserX,
  FileDown,
  Eye,
  Star
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  approvalRate: number;
  totalChatMessages: number;
  totalResources: number;
  totalBlogPosts: number;
  totalContacts: number;
  unreadContacts: number;
  recentActivities: number;
}

interface ApplicationStats {
  statusBreakdown: Record<string, number>;
  approvalRate: number;
  monthlyApplications: Array<{
    month: string;
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  }>;
  popularSkills: Array<{ skill: string; count: number }>;
  total: number;
}

interface ChatAnalytics {
  totalMessages: number;
  messagesThisWeek: number;
  activeRooms: number;
  topUsers: Array<{ userId: string; name: string; messageCount: number }>;
  messagesByType: Array<{ messageType: string; _count: { id: number } }>;
  attachmentStats: {
    totalAttachments: number;
    fileTypes: Array<{ mimeType: string; _count: { id: number } }>;
    totalSizeBytes: number;
  };
}

interface SecurityAnalytics {
  failedLogins: number;
  recentActivities: Array<any>;
  suspiciousActivities: number;
  threatReports: number;
}

interface ResourceAnalytics {
  totalDownloads: number;
  popularResources: Array<{
    title: string;
    downloads: number;
    views: number;
    rating: number;
  }>;
  resourcesByCategory: Array<{ category: string; _count: { id: number } }>;
  averageRating: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function AnalyticsPage() {
  const [dashboardStats, setDashboardStats] = React.useState<DashboardStats | null>(null);
  const [applicationStats, setApplicationStats] = React.useState<ApplicationStats | null>(null);
  const [userGrowth, setUserGrowth] = React.useState<any[]>([]);
  const [chatAnalytics, setChatAnalytics] = React.useState<ChatAnalytics | null>(null);
  const [securityAnalytics, setSecurityAnalytics] = React.useState<SecurityAnalytics | null>(null);
  const [resourceAnalytics, setResourceAnalytics] = React.useState<ResourceAnalytics | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load all analytics data
      const [
        dashboardResponse,
        appResponse,
        growthResponse,
        chatResponse,
        securityResponse,
        resourceResponse
      ] = await Promise.all([
        fetch('/api/analytics?type=dashboard'),
        fetch('/api/analytics?type=applications'),
        fetch('/api/analytics?type=growth'),
        fetch('/api/analytics?type=chat'),
        fetch('/api/analytics?type=security'),
        fetch('/api/analytics?type=resources'),
      ]);

      const [dashboardData, appData, growthData, chatData, securityData, resourceData] = await Promise.all([
        dashboardResponse.json(),
        appResponse.json(),
        growthResponse.json(),
        chatResponse.json(),
        securityResponse.json(),
        resourceResponse.json(),
      ]);

      if (dashboardData.success) setDashboardStats(dashboardData.data);
      if (appData.success) setApplicationStats(appData.data);
      if (growthData.success) setUserGrowth(growthData.data);
      if (chatData.success) setChatAnalytics(chatData.data);
      if (securityData.success) setSecurityAnalytics(securityData.data);
      if (resourceData.success) setResourceAnalytics(resourceData.data);

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 md:py-20">
        <div className="text-center">
          <div className="text-lg mb-4">Loading analytics...</div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Real-time insights into platform performance, user engagement, and system health.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardStats?.newUsersThisMonth || 0} this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.totalApplications || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats?.pendingApplications || 0} pending review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chat Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.totalChatMessages || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {chatAnalytics?.messagesThisWeek || 0} this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resources</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.totalResources || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {resourceAnalytics?.totalDownloads || 0} total downloads
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Growth Chart */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>User Growth Trend</CardTitle>
              <CardDescription>New user registrations over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))' 
                    }} 
                  />
                  <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Users</span>
                  <span className="font-semibold">{dashboardStats?.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users</span>
                  <span className="font-semibold">{dashboardStats?.activeUsers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>New This Month</span>
                  <span className="font-semibold">{dashboardStats?.newUsersThisMonth || 0}</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Activation Rate</span>
                    <span>{dashboardStats?.totalUsers ? Math.round((dashboardStats.activeUsers / dashboardStats.totalUsers) * 100) : 0}%</span>
                  </div>
                  <Progress value={dashboardStats?.totalUsers ? (dashboardStats.activeUsers / dashboardStats.totalUsers) * 100 : 0} />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Daily user registrations</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationStats && Object.entries(applicationStats.statusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {status === 'APPROVED' && <UserCheck className="h-4 w-4 text-green-500" />}
                        {status === 'PENDING' && <Clock className="h-4 w-4 text-yellow-500" />}
                        {status === 'REJECTED' && <UserX className="h-4 w-4 text-red-500" />}
                        <span className="capitalize">{status.toLowerCase()}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Approval Rate</span>
                      <span className="text-lg font-semibold">{applicationStats?.approvalRate.toFixed(1) || 0}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Skills</CardTitle>
                <CardDescription>Most requested skills in applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applicationStats?.popularSkills.slice(0, 8).map((skill, index) => (
                    <div key={skill.skill} className="flex justify-between items-center">
                      <span className="text-sm">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${(skill.count / (applicationStats?.popularSkills[0]?.count || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{skill.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Application Trends</CardTitle>
              <CardDescription>Application submissions over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationStats?.monthlyApplications || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="approved" fill="#10b981" name="Approved" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                  <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatAnalytics?.totalMessages || 0}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatAnalytics?.messagesThisWeek || 0}</div>
                <p className="text-xs text-muted-foreground">Messages sent</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Rooms</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatAnalytics?.activeRooms || 0}</div>
                <p className="text-xs text-muted-foreground">Chat rooms</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attachments</CardTitle>
                <FileDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatAnalytics?.attachmentStats.totalAttachments || 0}</div>
                <p className="text-xs text-muted-foreground">{formatBytes(chatAnalytics?.attachmentStats.totalSizeBytes || 0)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Users</CardTitle>
                <CardDescription>Most active chat participants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chatAnalytics?.topUsers.slice(0, 10).map((user, index) => (
                    <div key={user.userId} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <Badge variant="secondary">{user.messageCount} messages</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Types</CardTitle>
                <CardDescription>Distribution of message content types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chatAnalytics?.messagesByType.map((type, index) => ({
                        name: type.messageType,
                        value: type._count.id,
                        fill: COLORS[index % COLORS.length]
                      })) || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {chatAnalytics?.messagesByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>File Types</CardTitle>
              <CardDescription>Most shared file types in chat</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Type</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chatAnalytics?.attachmentStats.fileTypes.map((fileType, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{fileType.mimeType}</TableCell>
                      <TableCell className="text-right">{fileType._count.id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resourceAnalytics?.totalDownloads || 0}</div>
                <p className="text-xs text-muted-foreground">All resources</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.totalResources || 0}</div>
                <p className="text-xs text-muted-foreground">Resources available</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resourceAnalytics?.averageRating.toFixed(1) || 0}</div>
                <p className="text-xs text-muted-foreground">Out of 5 stars</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resourceAnalytics?.resourcesByCategory.length || 0}</div>
                <p className="text-xs text-muted-foreground">Different types</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Resources</CardTitle>
                <CardDescription>Most downloaded resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resourceAnalytics?.popularResources.slice(0, 10).map((resource, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{resource.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Download className="h-3 w-3" />
                          <span>{resource.downloads}</span>
                          <Eye className="h-3 w-3 ml-2" />
                          <span>{resource.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{resource.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Resources by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceAnalytics?.resourcesByCategory || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="_count.id" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityAnalytics?.failedLogins || 0}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityAnalytics?.suspiciousActivities || 0}</div>
                <p className="text-xs text-muted-foreground">Detected incidents</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Threat Reports</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityAnalytics?.threatReports || 0}</div>
                <p className="text-xs text-muted-foreground">User reports</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityAnalytics?.recentActivities.length || 0}</div>
                <p className="text-xs text-muted-foreground">System events</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest system security activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityAnalytics?.recentActivities.slice(0, 20).map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">
                        {new Date(activity.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{activity.user?.name || 'System'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{activity.action}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{activity.description}</TableCell>
                      <TableCell className="font-mono text-xs">{activity.ipAddress || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
