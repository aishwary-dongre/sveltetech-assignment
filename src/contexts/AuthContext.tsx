import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { encryptData,decryptData } from '../utils/encryption';
import { User, AuthContextType, LoginResult, SessionData } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | null>(null);


const MOCK_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const encryptedSession = sessionStorage.getItem('auth_session');
        if (encryptedSession) {
          const decryptedData: SessionData = decryptData(encryptedSession);
          if (decryptedData && decryptedData.expiresAt > Date.now()) {
            setUser(decryptedData.user);
          } else {
            // Session expired
            sessionStorage.removeItem('auth_session');
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        sessionStorage.removeItem('auth_session');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Validate credentials
      if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
        const userData: User = {
          id: '1',
          email: email,
          name: 'Admin User',
          role: 'admin'
        };

        // Create session with expiration (24 hours)
        const sessionData: SessionData = {
          user: userData,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000
        };

        // Encrypt and store session
        const encryptedSession = encryptData(sessionData);
        sessionStorage.setItem('auth_session', encryptedSession);

        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('auth_session');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};