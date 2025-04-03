
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as UIToaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useAuth } from "./contexts/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { isAuthenticated, isAuthReady } = useAuth();
  const location = useLocation();

  return (
    <TooltipProvider>
      <UIToaster />
      <Sonner />
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {isAuthenticated && <Sidebar />}
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          
          <main className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              
              <Route path="/chat/:id?" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default App;
