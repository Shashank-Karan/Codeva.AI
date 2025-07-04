import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Share2, Send, ImageIcon, Video, X } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import AppNavigation from "@/components/AppNavigation";
import type { PostWithAuthor } from "@shared/schema";

export default function Community() {
  const [content, setContent] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts"],
    retry: false,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    refetchIntervalInBackground: true,
  });

  // Auto-refresh effect for better real-time experience
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    }, 3000);

    return () => clearInterval(interval);
  }, [queryClient]);

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; code?: string; language?: string }) => {
      await apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      setContent("");
      setCode("");
      setLanguage("");
      removeImage();
      removeVideo();
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedVideo(file);
      const reader = new FileReader();
      reader.onload = () => setVideoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    setVideoPreview("");
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleCreatePost = () => {
    if (!content.trim() && !selectedImage && !selectedVideo) return;
    
    const formData = new FormData();
    formData.append('content', content.trim());
    if (code.trim()) formData.append('code', code.trim());
    if (language && language !== "none") formData.append('language', language);
    if (selectedImage) formData.append('image', selectedImage);
    if (selectedVideo) formData.append('video', selectedVideo);
    
    createPostMutation.mutate({
      content: content.trim(),
      code: code.trim() || undefined,
      language: (language && language !== "none") ? language : undefined,
      image: selectedImage ? imagePreview : undefined,
      video: selectedVideo ? videoPreview : undefined,
    });
  };

  const handleLikePost = (post: PostWithAuthor) => {
    if (!!!user) {
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Developer Community</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Share code snippets, get feedback, and learn from other developers.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Creation Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Create Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind? Share a code snippet, ask a question..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
              />
              
              <Textarea
                placeholder="Optional: Add code snippet..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-[80px] font-mono text-sm resize-none bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
              />
              
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
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

              {/* Media Upload Section */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => videoInputRef.current?.click()}
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 rounded-lg border border-slate-600"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Video Preview */}
              {videoPreview && (
                <div className="relative">
                  <video
                    src={videoPreview}
                    controls
                    className="max-h-48 rounded-lg border border-slate-600"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeVideo}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <Button
                onClick={handleCreatePost}
                disabled={(!content.trim() && !selectedImage && !selectedVideo) || createPostMutation.isPending || !!!user}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {createPostMutation.isPending ? "Posting..." : "Post"}
              </Button>
              
              {!!!user && (
                <p className="text-sm text-gray-400 text-center">
                  <button 
                    onClick={() => window.location.href = "/api/login"}
                    className="text-blue-400 hover:text-blue-300 hover:underline"
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
                <Card key={i} className="animate-pulse bg-slate-800/40 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-600 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-slate-600 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-600 rounded"></div>
                      <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-8">
                  <div className="text-blue-400 text-5xl mb-4">💬</div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Posts Yet</h3>
                  <p className="text-gray-300">Be the first to share something with the community!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {post.author ? getAvatarInitials(post.author.firstName, post.author.lastName, post.author.email) : 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-white">
                            {post.author 
                              ? (post.author.firstName && post.author.lastName 
                                  ? `${post.author.firstName} ${post.author.lastName}`
                                  : post.author.email || 'Unknown User'
                                )
                              : 'Unknown User'
                            }
                          </h4>
                          <span className="text-gray-400 text-sm">
                            {formatTimeAgo(post.createdAt!)}
                          </span>
                          {post.language && (
                            <span className="bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/30">
                              {post.language}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-200 mt-2">{post.content}</p>
                      </div>
                    </div>

                    {post.code && (
                      <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-4">
                        <pre className="text-sm font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap">
                          {post.code}
                        </pre>
                      </div>
                    )}

                    {/* Display post media */}
                    {(post as any).image && (
                      <div className="mb-4">
                        <img
                          src={(post as any).image}
                          alt="Post image"
                          className="max-w-full h-auto rounded-lg border border-slate-600"
                        />
                      </div>
                    )}

                    {(post as any).video && (
                      <div className="mb-4">
                        <video
                          src={(post as any).video}
                          controls
                          className="max-w-full h-auto rounded-lg border border-slate-600"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-6 text-gray-400">
                      <button
                        onClick={() => handleLikePost(post)}
                        disabled={likePostMutation.isPending}
                        className="flex items-center space-x-1 hover:text-red-400 transition duration-200"
                      >
                        <Heart 
                          className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        <span>{post.likes || 0}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-400 transition duration-200">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentsCount || 0}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-400 transition duration-200">
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
