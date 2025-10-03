// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  info_id: string;
  user_id: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  created_at?: string;
  updated_at?: string;
}
//user data api check this for the update api
interface User {
  userId: string;
  mobileNumber: string;
  email?: string;
  name?: string;
  dateOfBirth?: string;
  userData?: UserData;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User, userDataData?: UserData) => void;
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
            email: storedUser.email,
            name: storedUser.name,
            dateOfBirth: storedUser.dateOfBirth,
            userData: storedUser.userData,
          });
        }
      } catch (err) {
        console.error('Error parsing stored user data', err);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User, userDataData?: UserData) => {
    console.log(userDataData,"userDataDatauserDataData")
    const userToStore = {
      authToken: newToken,
      userId: userData.userId,
      mobileNumber: userData.mobileNumber,
      email: userDataData?.email || userData.email,
      name: userDataData?.full_name || userData.name,
      dateOfBirth: userDataData?.date_of_birth || userData.dateOfBirth,
      userData: userDataData,
    };
    
    localStorage.setItem('user', JSON.stringify(userToStore));
    
    setToken(newToken);
    setUser({
      userId: userData.userId,
      mobileNumber: userData.mobileNumber,
      email: userDataData?.email,
      name: userDataData?.full_name,
      dateOfBirth: userDataData?.date_of_birth,
      userData: userDataData,
    });
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