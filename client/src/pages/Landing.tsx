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
    </div>
  );
}