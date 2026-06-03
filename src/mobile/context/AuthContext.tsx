import React, { createContext, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { setAuthToken, setOnUnauthorized } from '@/util/api';

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
  login: (user: AuthUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = 'polaris:user';
const TOKEN_KEY = 'polaris:token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setOnUnauthorized(() => logout());
    return () => setOnUnauthorized(null);
  }, []);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(TOKEN_KEY),
        ]);

        if (storedUser && storedToken) {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          const expired = payload.exp && Date.now() / 1000 > payload.exp;

          if (expired) {
            await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
          } else {
            const parsedUser: AuthUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            setAuthToken(storedToken);
          }
        }
      } catch {
        await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(userData: AuthUser, jwt: string) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    await AsyncStorage.setItem(TOKEN_KEY, jwt);
    setAuthToken(jwt);
    setUser(userData);
    setToken(jwt);
  }

  async function logout() {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
    setAuthToken(null);
    setUser(null);
    setToken(null);
    setTimeout(() => router.replace('/login'), 0);
  }

  async function updateUser(patch: Partial<AuthUser>) {
    if (!user) return;
    const updated = { ...user, ...patch };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
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
