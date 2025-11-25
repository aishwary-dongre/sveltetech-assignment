export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface SessionData {
  user: User;
  expiresAt: number;
}