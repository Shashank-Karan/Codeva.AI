import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import FlowchartViewer from "@/components/FlowchartViewer";
import AppNavigation from "@/components/AppNavigation";
import { Lightbulb, GitBranch, ListOrdered, Workflow } from "lucide-react";

interface FlowchartData {
  nodes: Array<{
    id: string;
    type: 'start' | 'process' | 'decision' | 'end' | 'input' | 'output';
    label: string;
    x: number;
    y: number;
  }>;
  edges: Array<{
    from: string;
    to: string;
    label?: string;
  }>;
}

interface AnalysisResult {
  explanation: string;
  flowchart: string;
  visualFlowchart: FlowchartData;
  lineByLineAnalysis: Array<{
    line: number;
    content: string;
    explanation: string;
  }>;
}

export default function Visualize() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data: { title?: string; code: string; language: string }) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setResults(data.results);
    },
  });

  const handleAnalyze = () => {
    if (!code.trim() || !language) return;
    
    analyzeMutation.mutate({
      title: title.trim() || undefined,
      code: code.trim(),
      language,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Code Visualization</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Paste your code below to get AI-powered explanations, flowcharts, and line-by-line analysis.</p>
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Panel */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Input Your Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Enter a title for your code..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="language" className="text-gray-300">Programming Language</Label>
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
              <Label htmlFor="code" className="text-gray-300">Your Code</Label>
              <Textarea
                id="code"
                placeholder="Paste your code here..."
                className="min-h-[300px] font-mono text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={!code.trim() || !language || analyzeMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Workflow className="h-4 w-4 mr-2" />
              {analyzeMutation.isPending ? "Processing..." : "Process Code"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {analyzeMutation.isPending && (
              <LoadingSpinner message="Processing your code..." />
            )}

            {analyzeMutation.isError && (
              <div className="text-center py-12 px-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                  <div className="text-red-400 text-5xl mb-4">⚠️</div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Analysis Failed</h3>
                  <p className="text-gray-300">There was an error analyzing your code. Please check your input and try again.</p>
                </div>
              </div>
            )}

            {!results && !analyzeMutation.isPending && !analyzeMutation.isError && (
              <div className="text-center py-12 px-6">
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-8">
                  <div className="text-blue-400 text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Analyze</h3>
                  <p className="text-gray-300">Enter your code and select a programming language, then click "Process Code" to get started.</p>
                </div>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                {/* Code Explanation */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
                    Code Explanation
                  </h4>
                  <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-sm text-gray-200">
                    {results.explanation}
                  </div>
                </div>

                {/* Flowchart */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <GitBranch className="w-5 h-5 text-blue-400 mr-2" />
                    Flow Diagram
                  </h4>
                  <Tabs defaultValue="visual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-700/50 border-slate-600">
                      <TabsTrigger value="visual" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <Workflow className="w-4 h-4" />
                        Visual Diagram
                      </TabsTrigger>
                      <TabsTrigger value="text" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <GitBranch className="w-4 h-4" />
                        Text Flow
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="visual" className="mt-4">
                      {results.visualFlowchart ? (
                        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                          <FlowchartViewer data={results.visualFlowchart} className="w-full" />
                        </div>
                      ) : (
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center text-gray-400">
                          Visual flowchart not available
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="text" className="mt-4">
                      <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-sm text-gray-200 whitespace-pre-wrap font-mono">
                        {results.flowchart}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Line by Line */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <ListOrdered className="w-5 h-5 text-green-400 mr-2" />
                    Line-by-Line Analysis
                  </h4>
                  <div className="space-y-3">
                    {results.lineByLineAnalysis.map((line, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded font-mono min-w-[2.5rem] text-center flex-shrink-0">
                          {line.line}
                        </span>
                        <div className="flex-1 min-w-0">
                          <code className="text-sm text-blue-300 block mb-2 break-all">{line.content}</code>
                          <p className="text-sm text-gray-300 leading-relaxed">{line.explanation}</p>
                        </div>
                      </div>
                    ))}
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
