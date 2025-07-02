import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppNavigation from "@/components/AppNavigation";
import { AlertTriangle, Code, CheckCircle, Info } from "lucide-react";

interface DebugResult {
  issues: Array<{
    type: string;
    message: string;
    line?: number;
    severity: "error" | "warning" | "info";
  }>;
  fixedCode: string;
  explanation: string;
}

export default function Debug() {
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [results, setResults] = useState<DebugResult | null>(null);

  const debugMutation = useMutation({
    mutationFn: async (data: { originalCode: string; language: string }) => {
      const response = await apiRequest("POST", "/api/debug", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setResults(data.results);
    },
  });

  const handleDebug = () => {
    if (!code.trim() || !language) return;
    
    debugMutation.mutate({
      originalCode: code.trim(),
      language,
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-500/10 border-red-500/20 text-red-300";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-300";
      case "info":
        return "bg-blue-500/10 border-blue-500/20 text-blue-300";
      default:
        return "bg-slate-500/10 border-slate-500/20 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Code Debugger</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Find and fix issues in your code with AI-powered debugging assistance.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Submit Code for Debugging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="debug-language" className="text-gray-300">Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="nodejs">Node.js</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="debug-code" className="text-gray-300">Your Code</Label>
              <Textarea
                id="debug-code"
                placeholder="Paste the code you want to debug..."
                className="min-h-[350px] font-mono text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleDebug}
              disabled={!code.trim() || !language || debugMutation.isPending}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {debugMutation.isPending ? "Analyzing..." : "Analyze & Debug"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Debug Results</CardTitle>
          </CardHeader>
          <CardContent>
            {debugMutation.isPending && (
              <LoadingSpinner message="Analyzing your code..." />
            )}

            {debugMutation.isError && (
              <div className="text-center py-12 px-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                  <div className="text-red-400 text-5xl mb-4">⚠️</div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Debug Failed</h3>
                  <p className="text-gray-300">There was an error analyzing your code. Please check your input and try again.</p>
                </div>
              </div>
            )}

            {!results && !debugMutation.isPending && !debugMutation.isError && (
              <div className="text-center py-12 px-6">
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-8">
                  <div className="text-red-400 text-5xl mb-4">🐛</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Debug</h3>
                  <p className="text-gray-300">Enter your code and select a programming language, then click "Analyze & Debug" to find issues.</p>
                </div>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                {/* Issues Found */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                    Issues Found ({results.issues.length})
                  </h4>
                  <div className="space-y-3">
                    {results.issues.length === 0 ? (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-300">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          <span>No issues found! Your code looks good.</span>
                        </div>
                      </div>
                    ) : (
                      results.issues.map((issue, index) => (
                        <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
                          <div className="flex items-start space-x-3">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <p className="font-medium">{issue.type}</p>
                              <p className="text-sm mt-1">{issue.message}</p>
                              {issue.line && (
                                <p className="text-xs mt-1 opacity-75">Line {issue.line}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Original Code */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Code className="w-5 h-5 text-gray-400 mr-2" />
                    Original Code
                  </h4>
                  <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                    <pre className="text-sm font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap">
                      {code}
                    </pre>
                  </div>
                </div>

                {/* Fixed Code */}
                {results.fixedCode && results.fixedCode !== code && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Fixed Code
                    </h4>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <pre className="text-sm font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">
                        {results.fixedCode}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Detailed Explanation */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Info className="w-5 h-5 text-blue-400 mr-2" />
                    Detailed Explanation
                  </h4>
                  <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-sm text-gray-200">
                    {results.explanation}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
