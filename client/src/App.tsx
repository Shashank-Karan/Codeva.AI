import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Visualize from "@/pages/Visualize";
import Community from "@/pages/Community";
import Debug from "@/pages/Debug";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/visualize" component={Visualize} />
          <Route path="/community" component={Community} />
          <Route path="/debug" component={Debug} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
