import { Button } from "@/components/ui/button";
import { Code, Users, Bug, Eye, Home, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function AppNavigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/visualize", label: "Visualize", icon: Eye },
    { href: "/community", label: "Community", icon: Users },
    { href: "/debug", label: "Debug", icon: Bug },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">CodeVis.ai</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-2 relative group transition-all duration-200 ${
                      isActive 
                        ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" 
                        : "text-gray-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-slate-900/98 backdrop-blur-md border-b border-slate-700/50 shadow-xl">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start space-x-3 py-3 ${
                        isActive 
                          ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" 
                          : "text-gray-300 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}