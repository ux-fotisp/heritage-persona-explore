import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for existing auth state
    const authState = localStorage.getItem('auth_state');
    if (authState === 'authenticated') {
      setIsAuthenticated(true);
    }

    // Check for stored redirect path
    const storedRedirectPath = localStorage.getItem('auth_redirect_path');
    if (storedRedirectPath) {
      setRedirectPath(storedRedirectPath);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Dummy credentials check
    if (username === 'admin' && password === '123456') {
      setIsAuthenticated(true);
      localStorage.setItem('auth_state', 'authenticated');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth_state');
    localStorage.removeItem('auth_redirect_path');
    setRedirectPath(null);
  };

  const updateRedirectPath = (path: string | null) => {
    setRedirectPath(path);
    if (path) {
      localStorage.setItem('auth_redirect_path', path);
    } else {
      localStorage.removeItem('auth_redirect_path');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        redirectPath,
        setRedirectPath: updateRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};