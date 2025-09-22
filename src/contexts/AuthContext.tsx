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
    const storedUserStr = localStorage.getItem('user');
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        if (storedUser.authToken && storedUser.userId && storedUser.mobileNumber) {
          setToken(storedUser.authToken);
          setUser({
            userId: storedUser.userId,
            mobileNumber: storedUser.mobileNumber,
          });
        }
      } catch (err) {
        console.error('Error parsing stored user data', err);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
      const user = {
        "authToken":newToken,
        "userId": userData.userId,
        "mobileNumber": userData.mobileNumber
      }
      localStorage.setItem('user',JSON.stringify(user))
    
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
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