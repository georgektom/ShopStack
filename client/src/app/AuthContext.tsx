import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { AuthUser } from "../services/auth";
import { getCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from "../services/auth";
import { useCart } from "./CartContext";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { refreshCart } = useCart();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const nextUser = await getCurrentUser();
        setUser(nextUser);
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, []);

  async function login(input: { email: string; password: string }) {
    const nextUser = await loginRequest(input);
    setUser(nextUser);
    await refreshCart();
  }

  async function register(input: { name: string; email: string; password: string }) {
    const nextUser = await registerRequest(input);
    setUser(nextUser);
    await refreshCart();
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
    await refreshCart();
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
