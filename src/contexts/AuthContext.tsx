// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  userId: string;
  mobileNumber: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on app load
    const storedToken = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('userId');
    const storedMobileNumber = localStorage.getItem('mobileNumber');

    if (storedToken && storedUserId && storedMobileNumber) {
      setToken(storedToken);
      setUser({
        userId: storedUserId,
        mobileNumber: storedMobileNumber,
      });
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('mobileNumber', userData.mobileNumber);
    
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('mobileNumber');
    
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};