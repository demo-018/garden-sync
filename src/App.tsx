import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navigation } from "./components/navigation";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import PackagingDashboard, { PackOrderDetails } from "./pages/PackagingDashboard";
import DeliveryDashboard, { DeliveryOrderDetails } from "./pages/DeliveryDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    switch (user?.role) {
      case 'admin': return '/';
      case 'packaging': return '/packorders';
      case 'delivery': return '/deliveryorders';
      case 'manager': return '/manager';
      default: return '/';
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          {user?.role === 'admin' ? <AdminDashboard /> : <Navigate to={getDefaultRoute()} />}
        </ProtectedRoute>
      } />
      <Route path="/admin/order/:orderId" element={
        <ProtectedRoute>
          {user?.role === 'admin' ? <AdminOrderDetails /> : <Navigate to={getDefaultRoute()} />}
        </ProtectedRoute>
      } />
      <Route path="/packorders" element={
        <ProtectedRoute>
          {user?.role === 'packaging' ? <PackagingDashboard /> : <Navigate to={getDefaultRoute()} />}
        </ProtectedRoute>
      } />
      <Route path="/packorder/:orderId" element={
        <ProtectedRoute>
          {user?.role === 'packaging' ? <PackOrderDetails /> : <Navigate to={getDefaultRoute()} />}
        </ProtectedRoute>
      } />
      <Route path="/deliveryorders" element={
        <ProtectedRoute>
          {user?.role === 'delivery' ? <DeliveryDashboard /> : <Navigate to={getDefaultRoute()} />}
        </ProtectedRoute>
      } />
      <Route path="/deliveryorder/:orderId" element={
        <ProtectedRoute>
          {user?.role === 'delivery' ? <DeliveryOrderDetails /> : <Navigate to={getDefaultRoute()} />}
        </ProtectedRoute>
      } />
      <Route path="/manager" element={
        <ProtectedRoute>
          {user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to={getDefaultRoute()} />}
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <Navigation />}
      <main className={isAuthenticated ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
