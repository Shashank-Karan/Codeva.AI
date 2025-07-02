import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { Redirect } from "wouter";
import { Code2, Sparkles, Users, Zap } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loginMutation, registerMutation } = useAuth();

  // Simple state-based form instead of react-hook-form
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const onRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const { confirmPassword, ...userData } = registerData;
    registerMutation.mutate(userData);
  };

  const handleLoginChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterChange = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
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
                <form onSubmit={onLogin} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Username</label>
                    <Input 
                      type="text"
                      value={loginData.username}
                      onChange={(e) => handleLoginChange("username", e.target.value)}
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
                      onChange={(e) => handleLoginChange("password", e.target.value)}
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
                <form onSubmit={onRegister} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Username</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Choose a username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Enter your email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">First Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-gray-800 border-gray-700 text-white"
                                placeholder="First name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-gray-800 border-gray-700 text-white"
                                placeholder="Last name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password"
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Create a password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password"
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="Confirm your password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
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