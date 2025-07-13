import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppNavigation from "@/components/AppNavigation";
import { 
  MessageCircle, 
  Upload, 
  FileText, 
  Send, 
  Bot,
  User,
  Download,
  Copy,
  Trash2,
  FileCode,
  FileImage,
  Sparkles,
  Brain,
  Code,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  fileInfo?: {
    name: string;
    type: string;
    size: number;
  };
}

interface ChatMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  prompt: string;
}

const chatModes: ChatMode[] = [
  {
    id: 'general',
    name: 'General Chat',
    description: 'Ask anything! Get helpful answers on any topic',
    icon: MessageCircle,
    prompt: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses to any questions.'
  },
  {
    id: 'code',
    name: 'Code Helper',
    description: 'Debug, explain, and improve your code',
    icon: Code,
    prompt: 'You are a programming expert. Help with code analysis, debugging, optimization, and explanations. Provide practical solutions and best practices.'
  },
  {
    id: 'learning',
    name: 'Learning Tutor',
    description: 'Learn new concepts with detailed explanations',
    icon: BookOpen,
    prompt: 'You are an educational tutor. Break down complex topics into simple, understandable explanations with examples.'
  },
  {
    id: 'creative',
    name: 'Creative Assistant',
    description: 'Writing, brainstorming, and creative projects',
    icon: Sparkles,
    prompt: 'You are a creative writing and brainstorming assistant. Help with storytelling, content creation, and innovative ideas.'
  }
];

export default function ChatSimple() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<{ name: string; type: string; size: number } | null>(null);
  const [selectedMode, setSelectedMode] = useState<ChatMode>(chatModes[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; fileContent?: string; fileType?: string; mode: string }) => {
      const enhancedMessage = `${selectedMode.prompt}\n\nUser Question: ${data.message}`;
      const response = await apiRequest("POST", "/api/chat", {
        message: enhancedMessage,
        fileContent: data.fileContent,
        fileType: data.fileType
      });
      return await response.json();
    },
    onSuccess: (data) => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setMessage("");
      clearFile();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);
    setFileInfo({
      name: file.name,
      type: file.type,
      size: file.size
    });

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    
    reader.onerror = () => {
      toast({
        title: "Upload Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive"
      });
    };
    
    if (file.type === 'application/pdf') {
      setFileContent(`[PDF File: ${file.name}] - Please ask your question about this PDF file.`);
    } else if (file.type.startsWith('image/')) {
      setFileContent(`[Image File: ${file.name}] - Please describe what you'd like to know about this image.`);
    } else {
      reader.readAsText(file);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date(),
      fileInfo: fileInfo || undefined
    };

    setMessages(prev => [...prev, userMessage]);

    chatMutation.mutate({
      message: message.trim(),
      fileContent: fileContent || undefined,
      fileType: fileName ? fileName.split('.').pop() : undefined,
      mode: selectedMode.id
    });
  };

  const clearFile = () => {
    setFileContent("");
    setFileName("");
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chat-messages');
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard!",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage;
    if (type.includes('text') || type.includes('json') || type.includes('javascript') || type.includes('python')) return FileCode;
    return FileText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-blue-400" />
            AI Chat Assistant
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your intelligent companion for coding, learning, creativity, and more. Upload files and get instant AI-powered insights!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Modes Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Chat Modes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {chatModes.map((mode) => {
                  const IconComponent = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedMode.id === mode.id
                          ? 'bg-blue-600/30 border border-blue-500/50 text-blue-300'
                          : 'bg-slate-700/30 border border-slate-600/30 text-gray-300 hover:bg-slate-600/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{mode.name}</div>
                          <div className="text-xs opacity-75 mt-1">{mode.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm mt-4">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
                <Button
                  onClick={clearChat}
                  variant="outline"
                  size="sm"
                  className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm h-[600px] flex flex-col">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <selectedMode.icon className="w-5 h-5" />
                    {selectedMode.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-blue-300 border-blue-500/30">
                    {messages.length} messages
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-8 max-w-md mx-auto">
                      <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Ready to Chat!</h3>
                      <p className="text-gray-300 mb-4">
                        I'm here to help with {selectedMode.name.toLowerCase()}. Upload a file or ask me anything!
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge variant="outline" className="text-xs">Code Analysis</Badge>
                        <Badge variant="outline" className="text-xs">File Upload</Badge>
                        <Badge variant="outline" className="text-xs">Q&A</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`p-4 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-700/50 border border-slate-600 text-gray-200'
                        }`}>
                          {/* Message Header */}
                          <div className="flex items-center gap-2 mb-2">
                            {msg.type === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4 text-blue-400" />
                            )}
                            <span className="text-sm font-medium">
                              {msg.type === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <span className="text-xs opacity-60 ml-auto">
                              {msg.timestamp.toLocaleTimeString()}
                            </span>
                          </div>

                          {/* File Info */}
                          {msg.fileInfo && (
                            <div className="mb-3 p-2 bg-black/20 rounded border border-slate-600/30">
                              <div className="flex items-center gap-2 text-sm">
                                {(() => {
                                  const FileIcon = getFileIcon(msg.fileInfo.type);
                                  return <FileIcon className="w-4 h-4" />;
                                })()}
                                <span className="font-medium">{msg.fileInfo.name}</span>
                                <span className="text-xs opacity-60">
                                  ({formatFileSize(msg.fileInfo.size)})
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Message Content */}
                          <div className="whitespace-pre-wrap">{msg.content}</div>

                          {/* Message Actions */}
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-600/30">
                            <Button
                              onClick={() => copyMessage(msg.content)}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs opacity-60 hover:opacity-100"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Loading Indicator */}
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 max-w-[85%]">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-gray-200">AI Assistant</span>
                      </div>
                      <LoadingSpinner message="Thinking..." className="text-blue-400" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-slate-700/50 p-4">
                {/* File Upload Indicator */}
                {fileInfo && (
                  <div className="mb-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-300">
                        {(() => {
                          const FileIcon = getFileIcon(fileInfo.type);
                          return <FileIcon className="w-4 h-4" />;
                        })()}
                        <span className="text-sm font-medium">{fileInfo.name}</span>
                        <span className="text-xs opacity-75">({formatFileSize(fileInfo.size)})</span>
                      </div>
                      <Button 
                        onClick={clearFile}
                        variant="ghost" 
                        size="sm"
                        className="text-green-300 hover:text-green-200 h-6 px-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Input Controls */}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".txt,.pdf,.py,.js,.jsx,.ts,.tsx,.html,.css,.json,.xml,.csv,.md,.doc,.docx"
                    className="hidden"
                  />
                  
                  <Textarea
                    placeholder={`Ask me anything about ${selectedMode.name.toLowerCase()}... (Press Shift+Enter for new line)`}
                    className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 resize-none min-h-[60px] max-h-32"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || chatMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-[60px] px-6"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>

                {/* Helper Text */}
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>Current mode: {selectedMode.name}</span>
                  <span>Tip: Upload files for better context</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">File Upload</h3>
              <p className="text-gray-400 text-sm">Support for code, documents, images, and more</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Smart Modes</h3>
              <p className="text-gray-400 text-sm">Specialized AI behavior for different tasks</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Chat History</h3>
              <p className="text-gray-400 text-sm">Persistent conversations saved locally</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}