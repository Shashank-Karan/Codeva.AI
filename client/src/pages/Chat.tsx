
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppNavigation from "@/components/AppNavigation";
import { MessageCircle, Upload, FileText, Send } from "lucide-react";

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; fileContent?: string; fileType?: string }) => {
      const response = await apiRequest("POST", "/api/chat", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        { type: 'ai', content: data.response, timestamp: new Date() }
      ]);
      setMessage("");
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    
    if (file.type === 'application/pdf') {
      // For PDF files, we'll just set a placeholder since we can't easily extract text in frontend
      setFileContent(`[PDF File: ${file.name}] - Please ask your question about this PDF file.`);
    } else {
      reader.readAsText(file);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [
      ...prev,
      { type: 'user', content: message, timestamp: new Date() }
    ]);

    chatMutation.mutate({
      message: message.trim(),
      fileContent: fileContent || undefined,
      fileType: fileName ? fileName.split('.').pop() : undefined,
    });
  };

  const clearFile = () => {
    setFileContent("");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">AI Chat Assistant</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Upload files (PDF, code, documents) and ask questions. Get instant AI-powered answers!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Chat Messages */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6">
                      <div className="text-blue-400 text-3xl mb-3">🤖</div>
                      <h3 className="text-lg font-semibold text-white mb-2">Ready to Help!</h3>
                      <p className="text-gray-300">Upload a file or ask me anything. I'm here to help!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-700/50 border border-slate-600 text-gray-200'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* File Upload Section */}
              {fileName && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-300">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm">File uploaded: {fileName}</span>
                    </div>
                    <Button 
                      onClick={clearFile}
                      variant="ghost" 
                      size="sm"
                      className="text-green-300 hover:text-green-200"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {/* Input Section */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".txt,.pdf,.py,.js,.html,.css,.json,.xml,.csv,.md"
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message here... (e.g., 'Explain this code', 'Summarize this document', 'What are the main points?')"
                    className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {chatMutation.isPending && (
                <div className="mt-4">
                  <LoadingSpinner message="AI is thinking..." />
                </div>
              )}

              {chatMutation.isError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400">Failed to get AI response. Please try again.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <p>Upload a file (PDF, code, document) or just type your question</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <p>Ask specific questions like "Explain this code", "Summarize this document", "Find errors"</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <p>Get instant AI-powered responses and explanations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
