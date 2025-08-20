import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, demoUsers } from '@/data/demoData';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo login credentials
const demoCredentials = [
  { email: 'admin@vegdelivery.com', password: 'admin123', role: 'admin' as UserRole },
  { email: 'manager@vegdelivery.com', password: 'manager123', role: 'manager' as UserRole },
  { email: 'pack1@vegdelivery.com', password: 'pack123', role: 'packaging' as UserRole },
  { email: 'pack2@vegdelivery.com', password: 'pack123', role: 'packaging' as UserRole },
  { email: 'delivery1@vegdelivery.com', password: 'delivery123', role: 'delivery' as UserRole },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const credential = demoCredentials.find(
      cred => cred.email === email && cred.password === password
    );

    if (credential) {
      const demoUser = demoUsers.find(u => u.email === email);
      if (demoUser) {
        setUser({
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
        });
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}