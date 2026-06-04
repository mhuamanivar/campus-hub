"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api, { setAccessToken } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  career: string;
  bio?: string | null;
  avatarUrl?: string | null;
  role: string;
  interests: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  career: string;
  interests: string[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: User }>("/users/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ data: { accessToken: string; user: User } }>("/auth/login", {
      email,
      password,
    });
    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post<{ data: { accessToken: string; user: User } }>("/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
      career: data.career,
      interests: data.interests,
    });
    setAccessToken(res.data.data.accessToken);
    setUser(res.data.data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
