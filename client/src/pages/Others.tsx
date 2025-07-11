import { Link } from "wouter";
import AppNavigation from "@/components/AppNavigation";
import { Crown, Clock, Calculator, FileText, Zap, Puzzle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const otherFeatures = [
  { 
    href: "/chess", 
    label: "Chess", 
    icon: Crown, 
    description: "Play chess with AI or friends",
    color: "from-amber-500 to-orange-500"
  },
  { 
    href: "/timer", 
    label: "Timer", 
    icon: Clock, 
    description: "Pomodoro timer for coding",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    href: "/calculator", 
    label: "Calculator", 
    icon: Calculator, 
    description: "Developer calculator",
    color: "from-purple-500 to-pink-500"
  },
  { 
    href: "/notes", 
    label: "Notes", 
    icon: FileText, 
    description: "Quick notes and snippets",
    color: "from-yellow-500 to-orange-500"
  },
  { 
    href: "/tools", 
    label: "Tools", 
    icon: Zap, 
    description: "Developer utilities",
    color: "from-red-500 to-pink-500"
  },
  { 
    href: "/puzzles", 
    label: "Puzzles", 
    icon: Puzzle, 
    description: "Code puzzles and challenges",
    color: "from-indigo-500 to-purple-500"
  },
];

export default function Others() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AppNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Additional Features
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover powerful tools and utilities to enhance your coding experience
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {otherFeatures.map((feature) => {
            const Icon = feature.icon;
            
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="group bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    {/* Icon Container */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Feature Name */}
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
                      {feature.label}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 py-8 border-t border-slate-700/50">
          <p className="text-gray-400 text-sm">
            Click on any feature to explore its capabilities
          </p>
        </div>
      </div>
    </div>
  );
}