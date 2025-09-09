import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
  const { isAuthenticated, setRedirectPath } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Store the current path for redirect after login
      setRedirectPath(location.pathname + location.search);
    }
  }, [isAuthenticated, location, setRedirectPath]);

  // If not authenticated, return null (the auth logic will handle the redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}