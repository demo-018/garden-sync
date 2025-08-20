import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Users, 
  ShoppingCart,
  Settings,
  LogOut
} from "lucide-react";
import indiVegLogo from '@/assets/indiveg-logo.png';

export function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getNavigationForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: "Admin Dashboard", href: "/", icon: LayoutDashboard },
          { name: "Pack Orders", href: "/packorders", icon: Package },
          { name: "Delivery Orders", href: "/deliveryorders", icon: Truck },
          { name: "Manager Dashboard", href: "/manager", icon: Settings },
        ];
      case 'packaging':
        return [
          { name: "Pack Orders", href: "/packorders", icon: Package },
        ];
      case 'delivery':
        return [
          { name: "Delivery Orders", href: "/deliveryorders", icon: Truck },
        ];
      case 'manager':
        return [
          { name: "Manager Dashboard", href: "/manager", icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigationForRole();

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-3">
              <img src={indiVegLogo} alt="IndiVeg Hub Logo" className="h-8 w-8 object-contain" />
              <h1 className="text-xl font-bold text-primary">IndiVeg Hub</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name} ({user?.role})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}