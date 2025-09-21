// components/ProtectedRoute.tsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { SplashScreen } from './SplashScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <SplashScreen onComplete={() => {}} />;
  }

  if (!isAuthenticated) {
    // Redirect to auth page but save the attempted location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}