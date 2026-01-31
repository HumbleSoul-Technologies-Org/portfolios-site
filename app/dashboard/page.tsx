"use client"

import { 
  FolderKanban, 
  MessageSquare, 
  Eye,
  TrendingUp,
  Users,
  Clock
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis, 
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/useAuth"

// Stats data
const stats = [
  { 
    label: "Total Visitors", 
    value: "12,847", 
    change: "+23% this month",
    icon: Users,
    href: "/dashboard/settings"
  },
  { 
    label: "Total Projects", 
    value: "6", 
    change: "+2 this month",
    icon: FolderKanban,
    href: "/dashboard/projects"
  },
  { 
    label: "Messages", 
    value: "47", 
    change: "8 unread",
    icon: MessageSquare,
    href: "/dashboard/messages"
  },
  { 
    label: "Conversion Rate", 
    value: "3.7%", 
    change: "+0.5% this month",
    icon: TrendingUp,
    href: "/dashboard/messages"
  },
]

// Visitor trends data (last 30 days)
const visitorTrendsData = [
  { date: "Jan 1", visitors: 245, uniqueVisitors: 180 },
  { date: "Jan 5", visitors: 312, uniqueVisitors: 234 },
  { date: "Jan 10", visitors: 428, uniqueVisitors: 312 },
  { date: "Jan 15", visitors: 389, uniqueVisitors: 287 },
  { date: "Jan 20", visitors: 502, uniqueVisitors: 398 },
  { date: "Jan 25", visitors: 478, uniqueVisitors: 356 },
  { date: "Jan 30", visitors: 621, uniqueVisitors: 478 },
]

const visitorChartConfig: ChartConfig = {
  visitors: {
    label: "Total Visitors",
    color: "#3b82f6",
  },
  uniqueVisitors: {
    label: "Unique Visitors",
    color: "#14b8a6",
  },
}

// Page views data
const pageViewsData = [
  { page: "Home", views: 4523, fill: "#3b82f6" },
  { page: "Projects", views: 3245, fill: "#14b8a6" },
  { page: "About", views: 2156, fill: "#8b5cf6" },
  { page: "Services", views: 1834, fill: "#f59e0b" },
  { page: "Contact", views: 1456, fill: "#ef4444" },
  { page: "CV", views: 1233, fill: "#6366f1" },
]

const pageViewsChartConfig: ChartConfig = {
  views: {
    label: "Page Views",
  },
  Home: { label: "Home", color: "#3b82f6" },
  Projects: { label: "Projects", color: "#14b8a6" },
  About: { label: "About", color: "#8b5cf6" },
  Services: { label: "Services", color: "#f59e0b" },
  Contact: { label: "Contact", color: "#ef4444" },
  CV: { label: "CV", color: "#6366f1" },
}

// Contact conversions data
const contactConversionsData = [
  { month: "Aug", contacts: 5, visitors: 1820 },
  { month: "Sep", contacts: 8, visitors: 2156 },
  { month: "Oct", contacts: 12, visitors: 2890 },
  { month: "Nov", contacts: 7, visitors: 2340 },
  { month: "Dec", contacts: 15, visitors: 3456 },
  { month: "Jan", contacts: 11, visitors: 2985 },
]

const contactChartConfig: ChartConfig = {
  contacts: {
    label: "Contacts",
    color: "#3b82f6",
  },
  visitors: {
    label: "Visitors",
    color: "#e5e7eb",
  },
}

// Project views data
const projectViewsData = [
  { name: "E-Commerce Platform", views: 1842, fill: "#3b82f6" },
  { name: "Task Management App", views: 1456, fill: "#14b8a6" },
  { name: "Healthcare Dashboard", views: 1234, fill: "#8b5cf6" },
  { name: "Fitness Mobile App", views: 987, fill: "#f59e0b" },
  { name: "Inventory System", views: 756, fill: "#ef4444" },
  { name: "Social Platform", views: 534, fill: "#6366f1" },
]

const projectViewsChartConfig: ChartConfig = {
  views: {
    label: "Views",
  },
}

// Time spent data (in seconds, displayed as minutes)
const timeSpentData = [
  { page: "Projects", avgTime: 245 },
  { page: "About", avgTime: 189 },
  { page: "Services", avgTime: 156 },
  { page: "Home", avgTime: 134 },
  { page: "CV", avgTime: 178 },
  { page: "Contact", avgTime: 98 },
]

const timeSpentChartConfig: ChartConfig = {
  avgTime: {
    label: "Avg. Time (seconds)",
    color: "#14b8a6",
  },
}

// Weekly visitors by device
const deviceData = [
  { name: "Desktop", value: 58, fill: "#3b82f6" },
  { name: "Mobile", value: 35, fill: "#14b8a6" },
  { name: "Tablet", value: 7, fill: "#8b5cf6" },
]

const deviceChartConfig: ChartConfig = {
  value: { label: "Percentage" },
  Desktop: { label: "Desktop", color: "#3b82f6" },
  Mobile: { label: "Mobile", color: "#14b8a6" },
  Tablet: { label: "Tablet", color: "#8b5cf6" },
}

const recentMessages = [
  { id: 1, name: "Sarah Thompson", subject: "Website Redesign Project", time: "2 hours ago", unread: true },
  { id: 2, name: "Michael Chen", subject: "Mobile App Development", time: "5 hours ago", unread: true },
  { id: 3, name: "Emily Rodriguez", subject: "E-commerce Platform Inquiry", time: "1 day ago", unread: true },
]

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?from=/dashboard`);
    }
  }, [loading, user, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!loading && !user) return null;

  return (
    <div className="p-6 lg:p-8 max-h-screen overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your portfolio analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-accent transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Visitor Trends Chart */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visitor Trends
              </CardTitle>
              <CardDescription>Daily visitors over the last 30 days</CardDescription>
            </div>
            <Tabs defaultValue="30d" className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="7d" className="text-xs px-3">7D</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-3">30D</TabsTrigger>
                <TabsTrigger value="90d" className="text-xs px-3">90D</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={visitorChartConfig} className="h-[300px] w-full">
            <AreaChart data={visitorTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillUnique" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#fillVisitors)"
              />
              <Area
                type="monotone"
                dataKey="uniqueVisitors"
                stroke="#14b8a6"
                strokeWidth={2}
                fill="url(#fillUnique)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Two Column Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Most Viewed Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Pages</CardTitle>
            <CardDescription>Page views distribution this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pageViewsChartConfig} className="h-[280px] w-full">
              <BarChart data={pageViewsData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="page" 
                  tickLine={false} 
                  axisLine={false}
                  fontSize={12}
                  width={70}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                  {pageViewsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Contact Conversions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contact Conversions
            </CardTitle>
            <CardDescription>Users who contacted you vs total visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={contactChartConfig} className="h-[280px] w-full">
              <BarChart data={contactConversionsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="contacts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Three Column Row */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Most Viewed Projects */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Most Viewed Projects
              </CardTitle>
              <CardDescription>Project views this month</CardDescription>
            </div>
            <Link href="/dashboard/projects">
              <Button variant="outline" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ChartContainer config={projectViewsChartConfig} className="h-[250px] w-full">
              <BarChart data={projectViewsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  fontSize={11}
                  tickFormatter={(value) => value.length > 12 ? value.slice(0, 12) + '...' : value}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                  {projectViewsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Visitors by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={deviceChartConfig} className="h-[250px] w-full">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              {deviceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Spent and Recent Messages Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Average Time Spent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Spent per Page
            </CardTitle>
            <CardDescription>Average time visitors spend on each page</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={timeSpentChartConfig} className="h-[280px] w-full">
              <LineChart data={timeSpentData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="page" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={12}
                  tickFormatter={(value) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value) => {
                      const seconds = Number(value);
                      const mins = Math.floor(seconds / 60);
                      const secs = seconds % 60;
                      return [`${mins}:${secs.toString().padStart(2, '0')}`, "Avg. Time"];
                    }}
                  />} 
                />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#14b8a6" 
                  strokeWidth={2}
                  dot={{ fill: "#14b8a6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#14b8a6", strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>You have 8 unread messages</CardDescription>
            </div>
            <Link href="/dashboard/messages">
              <Button variant="outline" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div 
                  key={message.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${message.unread ? 'bg-accent' : 'bg-muted'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${message.unread ? 'font-semibold' : 'font-medium'}`}>
                        {message.name}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">47</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">8</p>
                <p className="text-xs text-muted-foreground">Unread</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">92%</p>
                <p className="text-xs text-muted-foreground">Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
