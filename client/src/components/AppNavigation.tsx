import { Button } from "@/components/ui/button";
import { Code, Users, Bug, Eye, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function AppNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/visualize", label: "Visualize", icon: Eye },
    { href: "/community", label: "Community", icon: Users },
    { href: "/debug", label: "Debug", icon: Bug },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CodeVis.ai</span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      isActive 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : "text-gray-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}