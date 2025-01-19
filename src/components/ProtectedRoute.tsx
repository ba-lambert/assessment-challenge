import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  console.log(user)

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
} 