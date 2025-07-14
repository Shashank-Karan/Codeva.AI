import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AppNavigation from "@/components/AppNavigation";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MessageSquare,
  Code,
  Brain,
  Crown,
  Plus,
  Filter
} from "lucide-react";
import type { Post, CodeAnalysis, DebugResult } from "@shared/schema";

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("posts");
  const [filters, setFilters] = useState({
    search: "",
    language: "all",
    sortBy: "createdAt"
  });
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/admin/posts", filters, page],
    enabled: activeTab === "posts"
  });

  const { data: analysesData, isLoading: analysesLoading } = useQuery({
    queryKey: ["/api/admin/analyses", filters, page],
    enabled: activeTab === "analyses"
  });

  const { data: debugsData, isLoading: debugsLoading } = useQuery({
    queryKey: ["/api/admin/debugs", filters, page],
    enabled: activeTab === "debugs"
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/posts/${postId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({
        title: "Post deleted",
        description: "Post has been deleted successfully",
      });
    }
  });

  const deleteAnalysisMutation = useMutation({
    mutationFn: async (analysisId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/analyses/${analysisId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analyses"] });
      toast({
        title: "Analysis deleted",
        description: "Code analysis has been deleted successfully",
      });
    }
  });

  const renderPostsTab = () => (
    <div className="space-y-6">
      {/* Posts Table */}
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Community Posts ({postsData?.total || 0})</span>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {postsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {postsData?.posts?.map((post: Post & { author: any }) => (
                <div key={post.id} className="flex items-start gap-4 p-4 bg-slate-700/20 rounded-lg border border-slate-700/30">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.author?.username?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{post.author?.username}</span>
                          {post.language && (
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              {post.language}
                            </Badge>
                          )}
                          <span className="text-gray-400 text-sm">
                            {new Date(post.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-200 mb-2 line-clamp-2">{post.content}</p>
                        
                        {post.code && (
                          <div className="bg-slate-800/50 border border-slate-600 rounded p-3 mb-2">
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              <code>{post.code.substring(0, 200)}{post.code.length > 200 ? "..." : ""}</code>
                            </pre>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {post.likes || 0} likes
                          </span>
                          <span>{post.commentsCount || 0} comments</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deletePostMutation.mutate(post.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalysesTab = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">
            Code Analyses ({analysesData?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {analysesData?.analyses?.map((analysis: CodeAnalysis & { user: any }) => (
                <div key={analysis.id} className="flex items-start gap-4 p-4 bg-slate-700/20 rounded-lg border border-slate-700/30">
                  <div className="flex-shrink-0 mt-1">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{analysis.title || "Untitled Analysis"}</span>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                            {analysis.language}
                          </Badge>
                          <span className="text-gray-400 text-sm">
                            by {analysis.user?.username || "Anonymous"}
                          </span>
                        </div>
                        
                        <div className="bg-slate-800/50 border border-slate-600 rounded p-3 mb-2">
                          <pre className="text-sm text-gray-300 overflow-x-auto">
                            <code>{analysis.code.substring(0, 150)}{analysis.code.length > 150 ? "..." : ""}</code>
                          </pre>
                        </div>
                        
                        <p className="text-gray-400 text-sm">
                          Created: {new Date(analysis.createdAt!).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteAnalysisMutation.mutate(analysis.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderDebugsTab = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">
            Debug Sessions ({debugsData?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {debugsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {debugsData?.debugs?.map((debug: DebugResult & { user: any }) => (
                <div key={debug.id} className="flex items-start gap-4 p-4 bg-slate-700/20 rounded-lg border border-slate-700/30">
                  <div className="flex-shrink-0 mt-1">
                    <Code className="w-6 h-6 text-orange-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                            {debug.language}
                          </Badge>
                          <span className="text-gray-400 text-sm">
                            by {debug.user?.username || "Anonymous"}
                          </span>
                        </div>
                        
                        <div className="bg-slate-800/50 border border-slate-600 rounded p-3 mb-2">
                          <pre className="text-sm text-gray-300 overflow-x-auto">
                            <code>{debug.originalCode.substring(0, 150)}{debug.originalCode.length > 150 ? "..." : ""}</code>
                          </pre>
                        </div>
                        
                        <p className="text-gray-400 text-sm">
                          Created: {new Date(debug.createdAt!).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-10 h-10 text-blue-400" />
            Content Management
          </h1>
          <p className="text-gray-300">Manage posts, code analyses, and debug sessions</p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search content..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
              
              <Select value={filters.language} onValueChange={(value) => setFilters({ ...filters, language: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="likes">Popularity</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/40 border-slate-700/50">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="analyses" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Code Analyses
            </TabsTrigger>
            <TabsTrigger value="debugs" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Debug Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {renderPostsTab()}
          </TabsContent>

          <TabsContent value="analyses">
            {renderAnalysesTab()}
          </TabsContent>

          <TabsContent value="debugs">
            {renderDebugsTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}