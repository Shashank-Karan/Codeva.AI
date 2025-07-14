import { Button } from "@/components/ui/button";
import { Home, Eye, Bug, Users, MessageCircle, LogOut, Menu, X, User, Code, MoreHorizontal, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AppNavigation() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
      },
      onError: () => {
        toast({
          title: "Logout failed",
          description: "There was an error logging out. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const mainNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/visualize", label: "Visualize", icon: Eye },
    { href: "/debug", label: "Debug", icon: Bug },
    { href: "/community", label: "Community", icon: Users },
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/others", label: "Others", icon: MoreHorizontal },
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
            <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">Codeva.AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => {
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



            {/* Admin Panel Link - Only show for admin user */}
            {user && user.username === 'admin' && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-2 relative group transition-all duration-200 ${
                    location.startsWith('/admin')
                      ? "bg-red-600/20 text-red-300 border border-red-500/30" 
                      : "text-gray-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Shield className={`h-4 w-4 transition-transform duration-200 ${location.startsWith('/admin') ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span>Admin</span>
                  {location.startsWith('/admin') && (
                    <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                  )}
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-700">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">Welcome, {user.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="text-gray-300 hover:text-white hover:bg-slate-800/60"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {logoutMutation.isPending ? "..." : "Logout"}
                </Button>
              </div>
            )}
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
              {/* Main Navigation Items */}
              {mainNavItems.map((item) => {
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



              {/* Mobile Admin Panel Link - Only show for admin user */}
              {user && user.username === 'admin' && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start space-x-3 py-3 ${
                      location.startsWith('/admin')
                        ? "bg-red-600/20 text-red-300 border border-red-500/30" 
                        : "text-gray-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin Panel</span>
                  </Button>
                </Link>
              )}

              {/* Mobile User Menu */}
              {user && (
                <div className="border-t border-slate-700 pt-4 mt-4 space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">Welcome, {user.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="w-full justify-start space-x-3 py-3 text-gray-300 hover:text-white hover:bg-slate-800/60"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}