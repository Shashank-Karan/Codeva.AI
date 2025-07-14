import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import AppNavigation from "@/components/AppNavigation";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Download,
  Calendar,
  Activity,
  Globe,
  Clock
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("users");

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["/api/admin/analytics", timeRange],
  });

  const { data: realtimeData } = useQuery({
    queryKey: ["/api/admin/analytics/realtime"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <AppNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const userGrowthData = analyticsData?.userGrowth || [];
  const activityData = analyticsData?.activity || [];
  const languageData = analyticsData?.languages || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <BarChart3 className="w-10 h-10 text-blue-400" />
                Analytics & Reports
              </h1>
              <p className="text-gray-300">Detailed insights and performance metrics</p>
            </div>
            
            <div className="flex gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {realtimeData?.activeUsers || 0}
                  </p>
                  <p className="text-green-400 text-xs mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +12% vs yesterday
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Page Views</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {realtimeData?.pageViews || 0}
                  </p>
                  <p className="text-green-400 text-xs mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +8% vs yesterday
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Globe className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Avg. Session</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {realtimeData?.avgSession || "0m"}
                  </p>
                  <p className="text-yellow-400 text-xs mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    +2m vs yesterday
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">API Calls</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {realtimeData?.apiCalls || 0}
                  </p>
                  <p className="text-purple-400 text-xs mt-1">
                    <Activity className="w-3 h-3 inline mr-1" />
                    +15% vs yesterday
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                User Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Daily Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="activity" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* More Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Programming Languages */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Popular Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Features */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Feature Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Code Analysis", usage: 85, color: "bg-blue-500" },
                  { name: "Debug Assistant", usage: 72, color: "bg-green-500" },
                  { name: "AI Chat", usage: 68, color: "bg-purple-500" },
                  { name: "Chess Games", usage: 45, color: "bg-yellow-500" },
                  { name: "Community Posts", usage: 38, color: "bg-red-500" }
                ].map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{feature.name}</span>
                      <span className="text-white">{feature.usage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${feature.color}`}
                        style={{ width: `${feature.usage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    event: "New user registration spike",
                    time: "2 hours ago",
                    type: "success"
                  },
                  {
                    event: "API rate limit reached",
                    time: "4 hours ago",
                    type: "warning"
                  },
                  {
                    event: "Database backup completed",
                    time: "6 hours ago",
                    type: "info"
                  },
                  {
                    event: "Security scan passed",
                    time: "12 hours ago",
                    type: "success"
                  },
                  {
                    event: "High memory usage detected",
                    time: "1 day ago",
                    type: "error"
                  }
                ].map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      event.type === 'success' ? 'bg-green-400' :
                      event.type === 'warning' ? 'bg-yellow-400' :
                      event.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-gray-200 text-sm">{event.event}</p>
                      <p className="text-gray-400 text-xs">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}