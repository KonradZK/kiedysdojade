import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../services/api";

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token: newToken } = await api.login(email, password);
      setToken(newToken);
      localStorage.setItem("token", newToken);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      await api.register(email, password, username);
      // Auto-login after successful registration
      await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
