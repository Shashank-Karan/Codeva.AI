import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Users, Bug, Eye, Menu } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CodeVis.ai</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-blue-300 hover:text-white transition-colors font-medium">Home</Link>
            <Link href="/visualize" className="text-gray-300 hover:text-white transition-colors">Visualize</Link>
            <Link href="/community" className="text-gray-300 hover:text-white transition-colors">Community</Link>
            <Link href="/debug" className="text-gray-300 hover:text-white transition-colors">Debug Code</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/10 hidden sm:inline-flex">
              Sign In
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign Up
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pt-12 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full text-blue-300 text-sm mb-8 border border-blue-500/20">
            <div className="h-2 w-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            AI-Powered Code Analysis
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Visualize Code
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              Like Never Before
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform complex code into interactive visualizations with step-by-step explanations, 
            live variable tracking, and intelligent flowcharts powered by AI.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/visualize">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Eye className="h-5 w-5 mr-2" />
                Start Visualizing
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="border-gray-400/30 text-gray-200 hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm">
                <Users className="h-5 w-5 mr-2" />
                Explore Community
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative code elements */}
        <div className="absolute top-20 left-10 text-blue-400/20 text-6xl font-mono hidden lg:block select-none">
          &lt;/&gt;
        </div>
        <div className="absolute top-40 right-20 text-purple-400/20 text-4xl font-mono hidden lg:block select-none">
          {'{'}
          {'}'}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Visualize Card */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl font-bold">Visualize</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Transform your code into interactive step-by-step visualizations with AI-powered explanations, 
                variable tracking, and dynamic flowcharts that make complex logic crystal clear.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Community Card */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl font-bold">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                Share your visualizations, ask questions, and learn from other developers. 
                Connect with a vibrant community of learners and experts sharing knowledge.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Debug Card */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-2xl font-bold">Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base leading-relaxed">
                AI-powered code debugging that automatically detects errors, suggests fixes, 
                and provides detailed explanations to help you write better, cleaner code.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 bg-slate-800/20 backdrop-blur-sm border-y border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of AI-driven code analysis in three simple steps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Paste Your Code</h3>
              <p className="text-gray-300 leading-relaxed">
                Simply paste your code snippet in any supported language. Our platform supports Python, JavaScript, 
                Java, C++, React, Node.js, TypeScript, Go, Rust, and many more programming languages.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Analysis</h3>
              <p className="text-gray-300 leading-relaxed">
                Our advanced AI engine analyzes your code structure, logic flow, and functionality. It creates 
                interactive flowcharts, provides line-by-line explanations, and identifies potential improvements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Bug className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Get Insights</h3>
              <p className="text-gray-300 leading-relaxed">
                Receive comprehensive visual explanations, debug suggestions, and optimization recommendations. 
                Share your results with the community or use them to enhance your coding skills.
              </p>
            </div>
          </div>

          {/* Interactive Demo Preview */}
          <div className="mt-20">
            <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Try It Now</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-6 font-mono text-sm">
                <div className="text-gray-400 mb-2"># Example Python function</div>
                <div className="text-blue-300">def <span className="text-yellow-300">fibonacci</span>(<span className="text-red-300">n</span>):</div>
                <div className="text-gray-300 ml-4">if n &lt;= 1:</div>
                <div className="text-gray-300 ml-8">return n</div>
                <div className="text-gray-300 ml-4">return fibonacci(n-1) + fibonacci(n-2)</div>
              </div>
              <div className="mt-6 text-center">
                <Link href="/visualize">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                    Visualize This Code
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CodeVis.ai</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transforming code understanding through AI-powered visualization and community collaboration.
              </p>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link href="/visualize" className="text-gray-400 hover:text-white transition-colors text-sm">Code Visualization</Link></li>
                <li><Link href="/debug" className="text-gray-400 hover:text-white transition-colors text-sm">AI Debugging</Link></li>
                <li><Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm">Developer Community</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Interactive Flowcharts</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Examples</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 CodeVis.ai. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Code className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Users className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Discord</span>
                <Bug className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}