import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Landing from "@/pages/Landing";
import Home from "./pages/Home";
import Visualize from "./pages/Visualize";
import Debug from "./pages/Debug";
import Chat from "./pages/ChatSimple";
import Community from "./pages/Community";
import Chess from "./pages/Chess";
import ChessGame from "./pages/ChessGame";
import Games from "./pages/Games";
import Timer from "./pages/Timer";
import Calculator from "./pages/Calculator";
import Notes from "./pages/Notes";
import Tools from "./pages/Tools";
import Puzzles from "./pages/Puzzles";
import Settings from "./pages/Settings";
import Others from "./pages/Others";
import AuthPageSimple from "@/pages/auth-page-simple";
import SimpleAuthTest from "@/pages/simple-auth-test";
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
      <Route path="/auth" component={AuthPageSimple} />
      <Route path="/test-auth" component={SimpleAuthTest} />
      {user ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/visualize" component={Visualize} />
          <Route path="/debug" component={Debug} />
          <Route path="/chat" component={Chat} />
          <Route path="/community" component={Community} />
          <Route path="/chess" component={Chess} />
          <Route path="/chess/game/:roomId" component={ChessGame} />
          <Route path="/games" component={Games} />
          <Route path="/timer" component={Timer} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/notes" component={Notes} />
          <Route path="/tools" component={Tools} />
          <Route path="/puzzles" component={Puzzles} />
          <Route path="/settings" component={Settings} />
          <Route path="/others" component={Others} />

        </>
      ) : (
        <>
          <Route path="/" component={Landing} />
          <Route path="/visualize">
            <ProtectedRoute>
              <Visualize />
            </ProtectedRoute>
          </Route>
          <Route path="/debug">
            <ProtectedRoute>
              <Debug />
            </ProtectedRoute>
          </Route>
          <Route path="/chat">
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          </Route>
          <Route path="/community">
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          </Route>
          <Route path="/chess">
            <ProtectedRoute>
              <Chess />
            </ProtectedRoute>
          </Route>
          <Route path="/chess/game/:roomId">
            <ProtectedRoute>
              <ChessGame />
            </ProtectedRoute>
          </Route>
          <Route path="/games">
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          </Route>
          <Route path="/timer">
            <ProtectedRoute>
              <Timer />
            </ProtectedRoute>
          </Route>
          <Route path="/calculator">
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          </Route>
          <Route path="/notes">
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          </Route>
          <Route path="/tools">
            <ProtectedRoute>
              <Tools />
            </ProtectedRoute>
          </Route>
          <Route path="/puzzles">
            <ProtectedRoute>
              <Puzzles />
            </ProtectedRoute>
          </Route>
          <Route path="/settings">
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </Route>
          <Route path="/others">
            <ProtectedRoute>
              <Others />
            </ProtectedRoute>
          </Route>
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