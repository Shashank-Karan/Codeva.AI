import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Code2, Sparkles, Users, Zap } from "lucide-react";

export default function AuthPageSimple() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const { confirmPassword, ...userData } = registerData;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex">
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-6">
            Welcome to CodeFlow
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Analyze, visualize, and debug your code with AI-powered tools. 
            Join our community of developers and enhance your coding journey.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Code Analysis</h3>
                <p className="text-gray-400">Get detailed explanations and flowcharts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Debug Assistant</h3>
                <p className="text-gray-400">Fix issues with AI-powered suggestions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Community</h3>
                <p className="text-gray-400">Share and discover code snippets</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-orange-600 p-3 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Visual Learning</h3>
                <p className="text-gray-400">Interactive flowcharts and diagrams</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">
                {isLogin ? "Sign In" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {isLogin 
                  ? "Welcome back! Sign in to your account" 
                  : "Join CodeFlow and start analyzing your code"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Username</label>
                    <Input
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Password</label>
                    <Input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Username</label>
                    <Input
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <Input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">First Name</label>
                      <Input
                        type="text"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="First name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Last Name</label>
                      <Input
                        type="text"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Password</label>
                    <Input
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Confirm Password</label>
                    <Input
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              )}
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {isLogin 
                    ? "Don't have an account? Create one here" 
                    : "Already have an account? Sign in here"
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}