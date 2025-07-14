import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AppNavigation from "@/components/AppNavigation";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Ban, 
  UserCheck, 
  UserX,
  Shield,
  Crown,
  Eye,
  Filter
} from "lucide-react";
import type { User } from "@shared/schema";

interface UserFilters {
  search: string;
  role: string;
  status: string;
  sortBy: string;
}

export default function UserManagement() {
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "all",
    status: "all",
    sortBy: "createdAt"
  });
  const [page, setPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["/api/admin/users", filters, page],
  });

  const banUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: number; reason: string }) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/ban`, { reason });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User banned",
        description: "User has been banned successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive"
      });
    }
  });

  const unbanUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/unban`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User unbanned",
        description: "User has been unbanned successfully",
      });
    }
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      const response = await apiRequest("PUT", `/api/admin/users/${userId}/role`, { role });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User deleted",
        description: "User has been deleted successfully",
      });
    }
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4" />;
      case "moderator":
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "moderator":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
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
            <Users className="w-10 h-10 text-blue-400" />
            User Management
          </h1>
          <p className="text-gray-300">Manage user accounts, roles, and permissions</p>
        </div>

        {/* Filters and Search */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              
              <Select value={filters.role} onValueChange={(value) => setFilters({ ...filters, role: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="lastLoginAt">Last Login</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Users ({usersData?.total || 0})</span>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Last Login</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.users?.map((user: User) => (
                    <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.username}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`flex items-center gap-1 w-fit ${getRoleBadgeColor(user.role || "user")}`}>
                          {getRoleIcon(user.role || "user")}
                          {user.role || "user"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {user.isBanned ? (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                            <UserX className="w-3 h-3 mr-1" />
                            Banned
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditUser(user)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          {user.isBanned ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => unbanUserMutation.mutate(user.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => banUserMutation.mutate({ userId: user.id, reason: "Manual ban" })}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteUserMutation.mutate(user.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-gray-400 text-sm">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, usersData?.total || 0)} of {usersData?.total || 0} users
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
                  disabled={!usersData?.hasMore}
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={selectedUser.username}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={selectedUser.email}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedUser.role || "user"}
                  onValueChange={(value) => updateUserRoleMutation.mutate({ userId: selectedUser.id, role: value })}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}