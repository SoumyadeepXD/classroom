'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface User {
  id: string;
  email: string;
  displayName: string;
  systemRole: string;
  institutionId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (tokens: { accessToken: string; user: User }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('current_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token validity with backend asynchronously
        apiFetch<User>('/users/me')
          .then((freshUser) => {
            if (freshUser) {
              setUser(freshUser);
              localStorage.setItem('current_user', JSON.stringify(freshUser));
            }
          })
          .catch(() => {
            // If token is invalid or rejected, purge and log out
            logout();
          });
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (data: { accessToken: string; user: User }) => {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('current_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
