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
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Code Debugger</h2>
        <p className="text-gray-600">Find and fix issues in your code with AI-powered debugging assistance.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Code for Debugging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="debug-language">Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
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
              <Label htmlFor="debug-code">Your Code</Label>
              <Textarea
                id="debug-code"
                placeholder="Paste the code you want to debug..."
                className="min-h-[350px] font-mono text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleDebug}
              disabled={!code.trim() || !language || debugMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <i className="fas fa-search mr-2"></i>
              {debugMutation.isPending ? "Analyzing..." : "Analyze & Debug"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Results</CardTitle>
          </CardHeader>
          <CardContent>
            {debugMutation.isPending && (
              <LoadingSpinner message="Analyzing your code..." />
            )}

            {debugMutation.isError && (
              <div className="text-center py-8 text-red-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                <p>Error debugging code. Please try again.</p>
              </div>
            )}

            {!results && !debugMutation.isPending && !debugMutation.isError && (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-bug text-4xl mb-4"></i>
                <p>Click "Analyze & Debug" to find issues in your code</p>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                {/* Issues Found */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    Issues Found ({results.issues.length})
                  </h4>
                  <div className="space-y-3">
                    {results.issues.length === 0 ? (
                      <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span>No issues found! Your code looks good.</span>
                        </div>
                      </div>
                    ) : (
                      results.issues.map((issue, index) => (
                        <div key={index} className={`border rounded-md p-4 ${getSeverityColor(issue.severity)}`}>
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
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <Code className="w-5 h-5 text-gray-500 mr-2" />
                    Original Code
                  </h4>
                  <div className="bg-gray-50 rounded-md p-4">
                    <pre className="text-sm font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap">
                      {code}
                    </pre>
                  </div>
                </div>

                {/* Fixed Code */}
                {results.fixedCode && results.fixedCode !== code && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Fixed Code
                    </h4>
                    <div className="bg-green-50 rounded-md p-4">
                      <pre className="text-sm font-mono text-gray-800 overflow-x-auto whitespace-pre-wrap">
                        {results.fixedCode}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Detailed Explanation */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <Info className="w-5 h-5 text-blue-500 mr-2" />
                    Detailed Explanation
                  </h4>
                  <div className="bg-blue-50 rounded-md p-4 text-sm text-blue-900">
                    {results.explanation}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
