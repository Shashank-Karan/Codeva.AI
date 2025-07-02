import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Visualize from "@/pages/Visualize";
import Community from "@/pages/Community";
import Debug from "@/pages/Debug";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      {user ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/visualize" component={Visualize} />
          <Route path="/community" component={Community} />
          <Route path="/debug" component={Debug} />
        </>
      ) : (
        <>
          <Route path="/" component={Landing} />
          <Route path="/visualize" component={Visualize} />
          <Route path="/community" component={Community} />
          <Route path="/debug" component={Debug} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
