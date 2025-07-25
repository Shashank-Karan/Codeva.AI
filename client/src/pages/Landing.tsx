import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Users, Bug, Eye, Menu, GitBranch, Zap, Terminal, Crown } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState, useRef } from "react";

export default function Landing() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    
    // Intersection Observer for fade-in/fade-out effects
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardIndex = parseInt(entry.target.getAttribute('data-card-index') || '0');
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set(Array.from(prev).concat(cardIndex)));
          } else {
            setVisibleCards(prev => {
              const newSet = new Set(prev);
              newSet.delete(cardIndex);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    // Observe all cards
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      </div>

      {/* Minimal floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating code brackets */}
        <div className="absolute top-[20%] left-[10%] text-blue-400/20 text-3xl font-mono animate-pulse select-none">
          &lt;/&gt;
        </div>
        <div className="absolute top-[60%] right-[15%] text-purple-400/20 text-2xl font-mono animate-pulse delay-500 select-none">
          {'{'}
        </div>
        <div className="absolute top-[70%] right-[12%] text-purple-400/20 text-2xl font-mono animate-pulse delay-700 select-none">
          {'}'}
        </div>
        
        {/* Floating icons */}
        <div className="absolute top-[30%] right-[20%] text-cyan-400/20 animate-bounce select-none">
          <GitBranch className="h-6 w-6" />
        </div>
        <div className="absolute top-[80%] left-[20%] text-green-400/20 animate-bounce delay-300 select-none">
          <Terminal className="h-5 w-5" />
        </div>
        <div className="absolute top-[40%] left-[15%] text-yellow-400/20 animate-bounce delay-1000 select-none">
          <Zap className="h-4 w-4" />
        </div>
        
        {/* Subtle flowchart elements */}
        <div className="absolute top-[50%] left-[5%] text-indigo-400/20 text-sm font-mono animate-pulse delay-1500 select-none">
          →
        </div>
        <div className="absolute top-[25%] right-[10%] text-pink-400/20 text-sm font-mono animate-pulse delay-2000 select-none">
          ◊
        </div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-50 p-4 lg:p-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">Codeva.AI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <span className="text-blue-300 font-medium">Welcome to Codeva</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 transition-all duration-300 hover:scale-105">
                Sign In
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="md:hidden text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pt-8 sm:pt-12 pb-16 sm:pb-20">
        <div className={`text-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full text-blue-300 text-sm mb-6 sm:mb-8 border border-blue-500/20 animate-[float_3s_ease-in-out_infinite_1s]">
            <div className="h-2 w-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            AI-Powered Code Analysis
          </div>

          {/* Main heading with floating and glowing effect */}
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-[floatSlow_4s_ease-in-out_infinite]">
              <span className="inline-block animate-[textGlow_3s_ease-in-out_infinite]">
                Visualize Code
              </span>
              <br />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-[textGlow_3s_ease-in-out_infinite_0.5s]">
                Like Never Before
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 blur-xl opacity-60 animate-pulse"></div>
                <div className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 blur-2xl opacity-30 animate-pulse delay-500"></div>
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-10 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
          Let AI simplify your code - visualize, explain, and monitor it in real time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Link href="/visualize">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Eye className="h-5 w-5 mr-2" />
                Start Visualizing
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Users className="h-5 w-5 mr-2" />
                Explore Community
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pb-16 sm:pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Visualize Card */}
          <Card 
            ref={(el) => cardRefs.current[0] = el}
            data-card-index="0"
            className={`bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-500 group hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transform ${
              visibleCards.has(0) 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <CardHeader className="pb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-blue-400/50">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl sm:text-2xl font-bold">Visualize</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Transform your code into interactive step-by-step visualizations with AI-powered explanations, 
                variable tracking, and dynamic flowcharts that make complex logic crystal clear.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Community Card */}
          <Card 
            ref={(el) => cardRefs.current[1] = el}
            data-card-index="1"
            className={`bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-500 group hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transform ${
              visibleCards.has(1) 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <CardHeader className="pb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-purple-400/50">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl sm:text-2xl font-bold">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Share your visualizations, ask questions, and learn from other developers. 
                Connect with a vibrant community of learners and experts sharing knowledge.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Debug Card */}
          <Card 
            ref={(el) => cardRefs.current[2] = el}
            data-card-index="2"
            className={`bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-500 group hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1 transform ${
              visibleCards.has(2) 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <CardHeader className="pb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-green-400/50">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl sm:text-2xl font-bold">Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-sm sm:text-base leading-relaxed">
                AI-powered code debugging that automatically detects errors, suggests fixes, 
                and provides detailed explanations to help you write better, cleaner code.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Chess Card */}
          <Card 
            ref={(el) => cardRefs.current[3] = el}
            data-card-index="3"
            className={`bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-500 group hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 transform ${
              visibleCards.has(3) 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <CardHeader className="pb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-amber-400/50">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-white text-xl sm:text-2xl font-bold">Chess</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Challenge AI opponents or play against friends in real-time multiplayer chess matches. 
                Features include game history, ratings, and interactive chess tutorials.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 bg-slate-800/20 backdrop-blur-sm border-y border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 sm:py-20">
          {/* Header */}
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">How It Works</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Transform your code understanding with AI-powered analysis, visualization, and debugging
            </p>
          </div>

          {/* Top Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16">
            {/* Code Input */}
            <div 
              ref={(el) => cardRefs.current[4] = el}
              data-card-index="4"
              className={`bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-900/60 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transform ${
                visibleCards.has(4) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-blue-400/50">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Code Input</h3>
              <p className="text-gray-400 text-sm">Paste any code snippet in 20+ programming languages</p>
            </div>

            {/* AI Analysis */}
            <div 
              ref={(el) => cardRefs.current[5] = el}
              data-card-index="5"
              className={`bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-900/60 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transform ${
                visibleCards.has(5) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-purple-400/50">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-gray-400 text-sm">Advanced AI processes your code logic and structure</p>
            </div>

            {/* Debugging */}
            <div 
              ref={(el) => cardRefs.current[6] = el}
              data-card-index="6"
              className={`bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-900/60 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-1 transform ${
                visibleCards.has(6) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-green-400/50">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Debugging</h3>
              <p className="text-gray-400 text-sm">Identify errors and get intelligent fix suggestions</p>
            </div>

            {/* Community */}
            <div 
              ref={(el) => cardRefs.current[7] = el}
              data-card-index="7"
              className={`bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 text-center group hover:bg-slate-900/60 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/20 hover:-translate-y-1 transform ${
                visibleCards.has(7) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-orange-400/50">
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
                          <p className="text-white text-sm font-medium">Sania Rajput</p>
                          <p className="text-gray-400 text-xs">Shared a sorting algorithm</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-gray-400 text-xs">
                        <span>👍 9 likes</span>
                        <span>💬 5 comments</span>
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

      {/* Anime-Style Footer */}
      <footer className="relative z-10 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-1500"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl blur opacity-30 animate-pulse"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Codeva.AI
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Transforming code understanding through AI-powered visualization and community collaboration.
              </p>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Features</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/auth" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Code Visualization</span>
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>AI Debugging</span>
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Developer Community</span>
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Chess Gaming</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Getting Started */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Get Started</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/auth" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Sign Up Free</span>
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Tutorials</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Documentation</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Examples</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Connect</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>About Us</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Support</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center space-x-2 group">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Terms of Service</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700/30 mt-12 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2025 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">Codeva.AI</span>. All rights reserved.
              </p>
              
              {/* Social Icons */}
              <div className="flex space-x-4">
                <a href="#" className="group relative">
                  <div className="w-10 h-10 bg-slate-800/50 hover:bg-blue-500/20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Code className="h-5 w-5 text-gray-400 group-hover:text-blue-400" />
                  </div>
                  <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
                <a href="#" className="group relative">
                  <div className="w-10 h-10 bg-slate-800/50 hover:bg-purple-500/20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Users className="h-5 w-5 text-gray-400 group-hover:text-purple-400" />
                  </div>
                  <div className="absolute -inset-1 bg-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
                <a href="#" className="group relative">
                  <div className="w-10 h-10 bg-slate-800/50 hover:bg-green-500/20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Bug className="h-5 w-5 text-gray-400 group-hover:text-green-400" />
                  </div>
                  <div className="absolute -inset-1 bg-green-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}