import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import AppNavigation from "@/components/AppNavigation";
import { Link } from "wouter";
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Activity,
  TrendingUp,
  Shield,
  Bell,
  BarChart3,
  Clock,
  UserCheck,
  UserX,
  Eye
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalPosts: number;
  totalAnalyses: number;
  totalChessGames: number;
  recentLogins: number;
  systemAlerts: number;
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard/stats", timeRange],
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["/api/admin/dashboard/activity"],
  });

  const { data: systemAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/admin/dashboard/alerts"],
  });

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

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Banned Users",
      value: stats?.bannedUsers || 0,
      icon: UserX,
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      title: "Total Posts",
      value: stats?.totalPosts || 0,
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Code Analyses",
      value: stats?.totalAnalyses || 0,
      icon: BarChart3,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Chess Games",
      value: stats?.totalChessGames || 0,
      icon: TrendingUp,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      title: "Recent Logins",
      value: stats?.recentLogins || 0,
      icon: Clock,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10"
    },
    {
      title: "System Alerts",
      value: stats?.systemAlerts || 0,
      icon: Bell,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-blue-400" />
                Admin Dashboard
              </h1>
              <p className="text-gray-300">Monitor and manage your application</p>
            </div>
            
            <div className="flex gap-2">
              {["24h", "7d", "30d"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === period
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700/50 text-gray-300 hover:bg-slate-600"
                  }`}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {recentActivity?.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-gray-200 text-sm">{activity.description}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.action}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-400" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-slate-700 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {systemAlerts && systemAlerts.length > 0 ? (
                    systemAlerts.map((alert: any, index: number) => {
                      const getAlertClasses = (color: string) => {
                        switch (color) {
                          case 'red':
                            return {
                              bg: 'bg-red-500/10 border-red-500/20',
                              dot: 'bg-red-400',
                              text: 'text-red-400'
                            };
                          case 'yellow':
                            return {
                              bg: 'bg-yellow-500/10 border-yellow-500/20',
                              dot: 'bg-yellow-400',
                              text: 'text-yellow-400'
                            };
                          case 'blue':
                            return {
                              bg: 'bg-blue-500/10 border-blue-500/20',
                              dot: 'bg-blue-400',
                              text: 'text-blue-400'
                            };
                          default:
                            return {
                              bg: 'bg-gray-500/10 border-gray-500/20',
                              dot: 'bg-gray-400',
                              text: 'text-gray-400'
                            };
                        }
                      };
                      
                      const classes = getAlertClasses(alert.color);
                      
                      return (
                        <div key={index} className={`p-3 ${classes.bg} border rounded-lg`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 ${classes.dot} rounded-full`}></div>
                            <span className={`${classes.text} text-sm font-medium`}>{alert.priority}</span>
                          </div>
                          <p className="text-gray-200 text-sm">{alert.message}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No system alerts at this time</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/users">
              <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/40 transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">Manage Users</h3>
                  <p className="text-gray-400 text-sm mt-1">View, edit, and manage user accounts</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/40 transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Settings className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="text-white font-semibold group-hover:text-green-300 transition-colors">System Settings</h3>
                  <p className="text-gray-400 text-sm mt-1">Configure application settings</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/logs">
              <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/40 transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Eye className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">Audit Logs</h3>
                  <p className="text-gray-400 text-sm mt-1">Review system activity and changes</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}