import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { authService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  signIn: (username: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const isLocalDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Check authentication status on load
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        if (isLocalDevelopment) {
          // Check local storage for token in development mode
          const token = localStorage.getItem('auth_token');
          if (token) {
            setAuthToken(token);
            setUser({
              username: localStorage.getItem('username') || 'user',
              email: localStorage.getItem('email')
            });
            setIsAuthenticated(true);
          }
        } else {
          // Use Cognito in production
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.toString();
          if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setAuthToken(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [isLocalDevelopment]);

  const handleSignIn = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      if (isLocalDevelopment) {
        // For development, use local auth service
        const response = await authService.login(username, password);
        const { token, user } = response;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', user.email);
        setAuthToken(token);
        setUser(user);
        setIsAuthenticated(true);
        return response;
      } else {
        // Use Cognito in production
        const { isSignedIn, nextStep } = await signIn({ username, password });
        if (isSignedIn) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.toString();
          if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
          }
        }
        return { isSignedIn, nextStep };
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (isLocalDevelopment) {
        // For development
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
      } else {
        // Use Cognito in production
        await signOut();
      }
      setIsAuthenticated(false);
      setUser(null);
      setAuthToken(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (authToken) {
      return authToken;
    }

    try {
      if (isLocalDevelopment) {
        return localStorage.getItem('auth_token');
      } else {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString() || null;
      }
    } catch (error) {
      return null;
    }
  }, [authToken, isLocalDevelopment]);

  // Register the auth token getter function globally
  useEffect(() => {
    authService.registerTokenGetter(getAuthToken);
  }, [getAuthToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signIn: handleSignIn,
        signOut: handleSignOut,
        getAuthToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};