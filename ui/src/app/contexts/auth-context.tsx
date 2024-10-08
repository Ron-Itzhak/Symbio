"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  loginError: string | null;
  register: (username: string, password: string) => Promise<number>;
  registerError: string | null;
  logout: () => void;
  isLoading: boolean;
  setLoginError: React.Dispatch<React.SetStateAction<string | null>>;
  isSubmitting: boolean;
}

interface User {
  username: string;
  id: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const apiUrl =
    typeof window === "undefined"
      ? process.env.INTERNAL_API
      : process.env.NEXT_PUBLIC_API;

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<any>(token);
        setUser({
          id: decodedToken.user_id,
          username: decodedToken.username,
        });
      } catch (error) {
        console.error("Invalid token", error);
        Cookies.remove("token");
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsSubmitting(true);
      const url = `${apiUrl}/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.token) {
        Cookies.set("token", data.token, { expires: 7 });
        const decodedToken = jwtDecode<any>(data.token);

        setUser({ id: decodedToken.user_id, username: decodedToken.username });
        setLoginError(null);
        router.push("/");
      } else {
        setLoginError(data.error);
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      setIsSubmitting(true);

      const url = `${apiUrl}/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.message) {
        setRegisterError(null);
        setLoginError(null);

        router.push("/login");
        return response.status;
      } else {
        return response.status;
      }
    } catch (error: any) {
      setRegisterError(error.message);
      return 500;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        setLoginError,
        loginError,
        register,
        registerError,
        logout,
        isSubmitting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
