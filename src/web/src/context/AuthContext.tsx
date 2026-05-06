'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

type UserType = 'student' | 'administrator';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  slug: string;
  type: UserType;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = 'polaris:user';
const TOKEN_KEY = 'polaris:token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logoutRef = useRef<() => void>(() => {});

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    logoutRef.current = () => {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setToken(null);
      window.location.replace('/LoginPage');
    };
  });

  useEffect(() => {
    function handleUnauthorized() {
      logoutRef.current();
    }
    window.addEventListener('polaris:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('polaris:unauthorized', handleUnauthorized);
  }, []);

  function login(userData: AuthUser, jwt: string) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, jwt);
    setUser(userData);
    setToken(jwt);
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  }

  function updateUser(patch: Partial<AuthUser>) {
    if (!user) return;
    const updated = { ...user, ...patch };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
