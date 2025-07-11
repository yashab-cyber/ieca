
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, FileText, AlertCircle } from 'lucide-react';

const visitorData = [
  { name: 'Jul 1', PageViews: 4000, UniqueVisitors: 2400 },
  { name: 'Jul 2', PageViews: 3000, UniqueVisitors: 1398 },
  { name: 'Jul 3', PageViews: 2000, UniqueVisitors: 9800 },
  { name: 'Jul 4', PageViews: 2780, UniqueVisitors: 3908 },
  { name: 'Jul 5', PageViews: 1890, UniqueVisitors: 4800 },
  { name: 'Jul 6', PageViews: 2390, UniqueVisitors: 3800 },
  { name: 'Jul 7', PageViews: 3490, UniqueVisitors: 4300 },
];

const engagementData = [
    { name: 'Jan', SessionDuration: 120 },
    { name: 'Feb', SessionDuration: 150 },
    { name: 'Mar', SessionDuration: 180 },
    { name: 'Apr', SessionDuration: 170 },
    { name: 'May', SessionDuration: 210 },
    { name: 'Jun', SessionDuration: 250 },
    { name: 'Jul', SessionDuration: 230 },
];

const topPagesData = [
    { path: '/', views: 12503 },
    { path: '/resources', views: 9870 },
    { path: '/join', views: 7540 },
    { path: '/contact', views: 4210 },
    { path: '/portal/login', views: 2109 },
];

const securityEventsData = [
    { time: '2024-07-22 14:30', event: 'Failed login attempt', ip: '192.168.1.100', priority: 'Medium' },
    { time: '2024-07-22 11:05', event: 'XSS attempt blocked', ip: '10.0.0.5', priority: 'High' },
    { time: '2024-07-21 22:10', event: 'Admin access granted', ip: '172.16.0.10', priority: 'Low' },
    { time: '2024-07-21 18:45', event: 'SQL injection attempt', ip: '203.0.113.25', priority: 'Critical' },
];

const priorityColors: Record<string, string> = {
    'Low': 'bg-blue-500/20 text-blue-700',
    'Medium': 'bg-yellow-500/20 text-yellow-700',
    'High': 'bg-orange-500/20 text-orange-700',
    'Critical': 'bg-red-500/20 text-red-700',
}

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
       <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Tracking key metrics for site performance, user engagement, and security.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+235</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">In the last 24 hours</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
            <CardDescription>Unique visitors and page views over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full pl-2">
            <ResponsiveContainer>
              <BarChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))'}}
                    contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        borderColor: 'hsl(var(--border))' 
                    }} 
                />
                <Legend iconSize={10} wrapperStyle={{fontSize: "12px", paddingTop: "20px"}}/>
                <Bar dataKey="UniqueVisitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PageViews" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Average session duration over time.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pl-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                         <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                        <Legend iconSize={10} wrapperStyle={{fontSize: "12px", paddingTop: "20px"}}/>
                        <Line type="monotone" dataKey="SessionDuration" name="Avg. Session (s)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most viewed pages on the site.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Path</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topPagesData.map(page => (
                            <TableRow key={page.path}>
                                <TableCell className="font-medium">{page.path}</TableCell>
                                <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>Security Event Log</CardTitle>
          <CardDescription>Recent security-related events recorded on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Source IP</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityEventsData.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{event.time}</TableCell>
                    <TableCell>{event.event}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{event.ip}</TableCell>
                    <TableCell>
                        <Badge className={`${priorityColors[event.priority]} border-transparent font-medium`}>{event.priority}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
