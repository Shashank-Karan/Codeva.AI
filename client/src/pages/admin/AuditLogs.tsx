import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import AppNavigation from "@/components/AppNavigation";
import { 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Settings,
  Trash2,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle
} from "lucide-react";
import type { AdminLog } from "@shared/schema";

interface LogFilters {
  search: string;
  action: string;
  timeRange: string;
  adminId: string;
}

export default function AuditLogs() {
  const [filters, setFilters] = useState<LogFilters>({
    search: "",
    action: "all",
    timeRange: "24h",
    adminId: "all"
  });
  const [page, setPage] = useState(1);

  const { data: logsData, isLoading } = useQuery({
    queryKey: ["/api/admin/logs", filters, page],
  });

  const { data: usersData } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Filter admin users from the response
  const admins = usersData?.users?.filter((user: any) => user.role === 'admin') || [];

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
      case "register":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "update":
      case "edit":
        return <Settings className="w-4 h-4 text-blue-400" />;
      case "delete":
      case "ban":
        return <Trash2 className="w-4 h-4 text-red-400" />;
      case "login":
      case "logout":
        return <User className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
      case "register":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "update":
      case "edit":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "delete":
      case "ban":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "login":
      case "logout":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Eye className="w-10 h-10 text-blue-400" />
            Audit Logs
          </h1>
          <p className="text-gray-300">Track system activities and administrative actions</p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              
              <Select value={filters.action} onValueChange={(value) => setFilters({ ...filters, action: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="ban">Ban</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.timeRange} onValueChange={(value) => setFilters({ ...filters, timeRange: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.adminId} onValueChange={(value) => setFilters({ ...filters, adminId: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Admin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Admins</SelectItem>
                  {admins?.map((admin: any) => (
                    <SelectItem key={admin.id} value={admin.id.toString()}>
                      {admin.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              Activity Logs ({logsData?.total || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logsData?.logs?.map((log: AdminLog) => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-700/20 rounded-lg border border-slate-700/30">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`flex items-center gap-1 ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </Badge>
                          <span className="text-gray-400 text-sm">
                            by Admin #{log.adminId}
                          </span>
                        </div>
                        
                        <p className="text-white font-medium mb-1">{log.description}</p>
                        
                        {(log.targetType || log.targetId) && (
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <span>Target:</span>
                            <Badge variant="outline" className="text-xs">
                              {log.targetType} #{log.targetId}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(log.createdAt!).toLocaleString()}
                          </span>
                          {log.ipAddress && (
                            <span>IP: {log.ipAddress}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {logsData?.logs?.length === 0 && (
                <div className="text-center py-12">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No logs found</h3>
                  <p className="text-gray-400">No activity logs match your current filters.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {logsData?.logs?.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/50">
                <p className="text-gray-400 text-sm">
                  Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, logsData?.total || 0)} of {logsData?.total || 0} logs
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!logsData?.hasMore}
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}