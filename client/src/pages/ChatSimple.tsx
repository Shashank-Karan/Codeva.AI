import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppNavigation from "@/components/AppNavigation";
import { 
  Upload, 
  Send, 
  Bot,
  User,
  Copy,
  Trash2,
  FileCode,
  FileImage,
  FileText,
  Brain,
  Code,
  BookOpen,
  MessageCircle,
  Sparkles
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

const chatModes = [
  { id: 'general', name: 'General', icon: MessageCircle, prompt: 'You are a helpful AI assistant.' },
  { id: 'code', name: 'Code', icon: Code, prompt: 'You are a programming expert.' },
  { id: 'learning', name: 'Learning', icon: BookOpen, prompt: 'You are an educational tutor.' },
  { id: 'creative', name: 'Creative', icon: Sparkles, prompt: 'You are a creative assistant.' }
];

export default function ChatSimple() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState(chatModes[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; fileContent?: string; fileType?: string }) => {
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

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
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
      fileInfo: fileName ? { name: fileName, type: 'file', size: 0 } : undefined
    };

    setMessages(prev => [...prev, userMessage]);

    chatMutation.mutate({
      message: message.trim(),
      fileContent: fileContent || undefined,
      fileType: fileName ? fileName.split('.').pop() : undefined
    });
  };

  const clearFile = () => {
    setFileContent("");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages removed",
    });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-blue-400" />
            AI Chat Assistant
          </h1>
          <p className="text-gray-300">
            Upload files and ask questions. Get instant AI-powered answers!
          </p>
        </div>

        {/* Chat Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2 p-1 bg-slate-800/40 rounded-lg border border-slate-700/50">
            {chatModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedMode.id === mode.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {mode.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Chat Container */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm h-[500px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Chat!</h3>
                <p className="text-gray-300">
                  Ask me anything or upload a file to get started.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700/50 border border-slate-600 text-gray-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {msg.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-sm font-medium">
                        {msg.type === 'user' ? 'You' : 'AI'}
                      </span>
                      <span className="text-xs opacity-60 ml-auto">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>

                    {msg.fileInfo && (
                      <div className="mb-3 p-2 bg-black/20 rounded text-sm">
                        📎 {msg.fileInfo.name}
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    
                    <button
                      onClick={() => copyMessage(msg.content)}
                      className="mt-2 text-xs opacity-60 hover:opacity-100 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>
              ))
            )}
            
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-200">AI</span>
                  </div>
                  <LoadingSpinner message="Thinking..." className="text-blue-400" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700/50 p-4">
            {fileName && (
              <div className="mb-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-300 text-sm flex items-center justify-between">
                <span>📎 {fileName}</span>
                <button onClick={clearFile} className="text-green-300 hover:text-green-200">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".txt,.pdf,.py,.js,.jsx,.ts,.tsx,.html,.css,.json,.xml,.csv,.md"
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                <Upload className="w-4 h-4" />
              </Button>
              
              <Textarea
                placeholder="Ask me anything... (Shift+Enter for new line)"
                className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 resize-none min-h-[50px]"
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
                className="bg-blue-600 hover:bg-blue-700 px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>Mode: {selectedMode.name}</span>
              <button onClick={clearChat} className="hover:text-gray-300">
                Clear chat
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}