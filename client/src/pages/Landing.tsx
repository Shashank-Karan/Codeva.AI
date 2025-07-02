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
            <Link href="/auth">
              <Button variant="ghost" className="text-white hover:bg-white/10 hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up
              </Button>
            </Link>
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
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your code understanding with AI-powered analysis, visualization, and debugging
            </p>
          </div>

          {/* Top Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {/* Code Input */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Code Input</h3>
              <p className="text-gray-400 text-sm">Paste any code snippet in 20+ programming languages</p>
            </div>

            {/* AI Analysis */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-gray-400 text-sm">Advanced AI processes your code logic and structure</p>
            </div>

            {/* Visualization */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Debugging</h3>
              <p className="text-gray-400 text-sm">Identify errors and get intelligent fix suggestions</p>
            </div>

            {/* Community */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-900/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-gray-400 text-sm">Share insights and learn from other developers</p>
            </div>
          </div>

          {/* Detailed Feature Sections */}
          <div className="space-y-16">
            {/* Code Visualization Feature */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Interactive Code Visualization</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    Transform complex algorithms into clear, interactive flowcharts that show exactly how your code executes step by step.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Visual Flow Diagrams:</strong> See your code logic as interactive flowcharts with clickable nodes</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Line-by-Line Analysis:</strong> Get detailed explanations for every line of code</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Variable Tracking:</strong> Monitor how variables change throughout execution</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Multi-Language Support:</strong> Works with Python, JavaScript, Java, C++, and more</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-white">Live Demo</h4>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Flowchart visualization mockup */}
                    <div className="bg-slate-800/80 rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-16 h-12 bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-blue-300 font-mono">START</span>
                        </div>
                        <div className="w-6 h-0.5 bg-gray-600"></div>
                        <div className="w-16 h-12 bg-purple-500/20 border-2 border-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-purple-300 font-mono">PROCESS</span>
                        </div>
                        <div className="w-6 h-0.5 bg-gray-600"></div>
                        <div className="w-16 h-12 bg-green-500/20 border-2 border-green-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-green-300 font-mono">END</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/visualize">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        Try Visualization →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Debugging Feature */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <h3 className="text-3xl font-bold text-white mb-6">Intelligent Code Debugging</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    AI-powered debugging that not only finds issues but provides detailed explanations and automatic fixes.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Error Detection:</strong> Automatically identify syntax errors, logic bugs, and performance issues</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Smart Fixes:</strong> Get intelligent suggestions with corrected code snippets</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Best Practices:</strong> Learn coding standards and optimization techniques</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Code Quality:</strong> Improve readability, maintainability, and performance</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="lg:order-1 relative">
                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-white">Debug Analysis</h4>
                    <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm">
                      3 Issues Found
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-300 text-sm font-medium">Syntax Error</span>
                      </div>
                      <p className="text-gray-400 text-xs">Missing semicolon on line 12</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-yellow-300 text-sm font-medium">Performance</span>
                      </div>
                      <p className="text-gray-400 text-xs">Inefficient loop detected</p>
                    </div>
                    <Link href="/debug">
                      <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white">
                        Start Debugging →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Feature */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Developer Community Hub</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    Connect with developers worldwide, share your code visualizations, and learn from the community's collective knowledge.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Code Sharing:</strong> Post your algorithms and visualizations for others to learn from</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Collaborative Learning:</strong> Get feedback and suggestions from experienced developers</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Discussion Forums:</strong> Ask questions and participate in coding discussions</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                      <span><strong className="text-white">Achievement System:</strong> Earn points and badges for helping others</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-white">Community Feed</h4>
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">
                      Active
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-800/80 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <div>
                          <p className="text-white text-sm font-medium">Sarah_Dev</p>
                          <p className="text-gray-400 text-xs">Shared a sorting algorithm</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-400 text-xs">
                        <span>👍 24 likes</span>
                        <span>💬 8 comments</span>
                      </div>
                    </div>
                    <Link href="/community">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        Join Community →
                      </Button>
                    </Link>
                  </div>
                </div>
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