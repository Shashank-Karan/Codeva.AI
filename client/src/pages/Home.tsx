import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import AppNavigation from "@/components/AppNavigation";
import { Eye, Users, Bug, Sparkles, Code, TrendingUp } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Eye,
      title: "Code Visualization",
      description: "Transform your code into interactive flowcharts and visual diagrams with AI-powered analysis.",
      href: "/visualize",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "Share code snippets, collaborate with developers, and learn from the community.",
      href: "/community",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Bug,
      title: "Debug Code",
      description: "Get intelligent suggestions to fix bugs and improve your code quality.",
      href: "/debug",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { label: "Code Analyses", value: "10K+", icon: Code },
    { label: "Developers", value: "5K+", icon: Users },
    { label: "Success Rate", value: "98%", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-blue-300 text-sm font-medium">AI-Powered Code Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CodeFlow</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Understand, visualize, and debug your code with the power of AI. 
            Transform complex algorithms into clear flowcharts and get intelligent insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/visualize">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                <Eye className="h-5 w-5 mr-2" />
                Start Analyzing
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" size="lg" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg">
                <Users className="h-5 w-5 mr-2" />
                Join Community
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group">
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                  <Link href={feature.href}>
                    <Button className="w-full bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
