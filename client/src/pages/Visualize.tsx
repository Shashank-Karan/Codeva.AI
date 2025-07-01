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
    <div>
      <AppNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Code Visualization</h2>
        <p className="text-gray-600">Paste your code below to get AI-powered explanations, flowcharts, and line-by-line analysis.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Input Your Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Enter a title for your code..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="language">Programming Language</Label>
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
              <Label htmlFor="code">Your Code</Label>
              <Textarea
                id="code"
                placeholder="Paste your code here..."
                className="min-h-[300px] font-mono text-sm"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleAnalyze}
              disabled={!code.trim() || !language || analyzeMutation.isPending}
              className="w-full"
            >
              <i className="fas fa-cogs mr-2"></i>
              {analyzeMutation.isPending ? "Processing..." : "Process Code"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {analyzeMutation.isPending && (
              <LoadingSpinner message="Processing your code..." />
            )}

            {analyzeMutation.isError && (
              <div className="text-center py-8 text-red-500">
                <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Error analyzing code. Please try again.</p>
              </div>
            )}

            {!results && !analyzeMutation.isPending && !analyzeMutation.isError && (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-code text-4xl mb-4"></i>
                <p>Click "Process Code" to analyze your code</p>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                {/* Code Explanation */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                    Code Explanation
                  </h4>
                  <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700">
                    {results.explanation}
                  </div>
                </div>

                {/* Flowchart */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <GitBranch className="w-5 h-5 text-blue-500 mr-2" />
                    Flow Diagram
                  </h4>
                  <Tabs defaultValue="visual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="visual" className="flex items-center gap-2">
                        <Workflow className="w-4 h-4" />
                        Visual Diagram
                      </TabsTrigger>
                      <TabsTrigger value="text" className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        Text Flow
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="visual" className="mt-4">
                      {results.visualFlowchart ? (
                        <FlowchartViewer data={results.visualFlowchart} className="w-full" />
                      ) : (
                        <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500">
                          Visual flowchart not available
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="text" className="mt-4">
                      <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {results.flowchart}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Line by Line */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <ListOrdered className="w-5 h-5 text-green-500 mr-2" />
                    Line-by-Line Analysis
                  </h4>
                  <div className="space-y-2">
                    {results.lineByLineAnalysis.map((line, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-mono min-w-[2rem] text-center">
                          {line.line}
                        </span>
                        <div className="flex-1">
                          <code className="text-sm text-gray-800 block mb-1">{line.content}</code>
                          <p className="text-sm text-gray-600">{line.explanation}</p>
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
