import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import AppNavigation from "@/components/AppNavigation";
import type { PostWithAuthor } from "@shared/schema";

export default function Community() {
  const [content, setContent] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts"],
    retry: false,
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; code?: string; language?: string }) => {
      await apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      setContent("");
      setCode("");
      setLanguage("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        await apiRequest("DELETE", `/api/posts/${postId}/like`);
      } else {
        await apiRequest("POST", `/api/posts/${postId}/like`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    if (!content.trim()) return;
    
    createPostMutation.mutate({
      content: content.trim(),
      code: code.trim() || undefined,
      language: (language && language !== "none") ? language : undefined,
    });
  };

  const handleLikePost = (post: PostWithAuthor) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    
    likePostMutation.mutate({
      postId: post.id,
      isLiked: post.isLiked || false,
    });
  };

  const getAvatarInitials = (firstName?: string | null, lastName?: string | null, email?: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Developer Community</h2>
          <p className="text-gray-300">Share code snippets, get feedback, and learn from other developers.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Creation Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind? Share a code snippet, ask a question..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              
              <Textarea
                placeholder="Optional: Add code snippet..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-[80px] font-mono text-sm resize-none"
              />
              
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Language (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="C++">C++</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="Go">Go</SelectItem>
                  <SelectItem value="Rust">Rust</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleCreatePost}
                disabled={!content.trim() || createPostMutation.isPending || !isAuthenticated}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {createPostMutation.isPending ? "Posting..." : "Post"}
              </Button>
              
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 text-center">
                  <button 
                    onClick={() => window.location.href = "/api/login"}
                    className="text-blue-600 hover:underline"
                  >
                    Sign in
                  </button> to create posts
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feed */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No posts yet. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {post.author ? getAvatarInitials(post.author.firstName, post.author.lastName, post.author.email) : 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">
                            {post.author 
                              ? (post.author.firstName && post.author.lastName 
                                  ? `${post.author.firstName} ${post.author.lastName}`
                                  : post.author.email || 'Unknown User'
                                )
                              : 'Unknown User'
                            }
                          </h4>
                          <span className="text-gray-500 text-sm">
                            {formatTimeAgo(post.createdAt!)}
                          </span>
                          {post.language && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {post.language}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mt-2">{post.content}</p>
                      </div>
                    </div>

                    {post.code && (
                      <div className="bg-gray-50 rounded-md p-4 mb-4">
                        <pre className="text-sm font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap">
                          {post.code}
                        </pre>
                      </div>
                    )}

                    <div className="flex items-center space-x-6 text-gray-500">
                      <button
                        onClick={() => handleLikePost(post)}
                        disabled={likePostMutation.isPending}
                        className="flex items-center space-x-1 hover:text-red-500 transition duration-200"
                      >
                        <Heart 
                          className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        <span>{post.likes || 0}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-500 transition duration-200">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentsCount || 0}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-500 transition duration-200">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
