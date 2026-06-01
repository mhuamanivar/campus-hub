"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// ── Tipos ────────────────────────────────────────────
export interface User {
  name: string;
  email: string;
  career: string;
  interests: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  career: string;
  interests: string[];
}

// ── Contexto ─────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ─────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true al inicio

  useEffect(() => {
    // Cargamos el usuario al montar la app
    try {
      const stored = localStorage.getItem("campushub_user");
      const loggedIn = localStorage.getItem("campushub_isLoggedIn");

      if (stored && loggedIn === "true") {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      // Si hay datos corruptos, limpiamos
      localStorage.removeItem("campushub_user");
      localStorage.removeItem("campushub_isLoggedIn");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const stored = localStorage.getItem("campushub_user");
    if (!stored) throw new Error("Usuario no encontrado");

    // IMPORTANTE: en producción real esto sería una llamada a tu API/backend
    // Nunca compares contraseñas en el cliente con datos reales
    const storedData = JSON.parse(stored);

    if (storedData.email !== email || storedData.password !== password) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Guardamos solo los datos públicos (sin contraseña)
    const { password: _, ...publicUser } = storedData;
    setUser(publicUser);
    localStorage.setItem("campushub_isLoggedIn", "true");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campushub_isLoggedIn");
  };

  const register = async (data: RegisterData) => {
    // En producción: llamada a tu API con hash de contraseña en el servidor
    // Para el MVP guardamos todo localmente (incluyendo password — solo para demo)
    localStorage.setItem("campushub_user", JSON.stringify(data));

    const { password: _, ...publicUser } = data;
    setUser(publicUser);
    localStorage.setItem("campushub_isLoggedIn", "true");
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

// ── Hook ─────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}