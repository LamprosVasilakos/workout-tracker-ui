import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService.ts";
import { AuthContext } from "./authContext.ts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem("username"),
  );
  const navigate = useNavigate();

  const isAuthenticated = !!token;

  const login = async (usernameInput: string, password: string) => {
    const response = await authService.login(usernameInput, password);
    setToken(response.token);
    setUsername(response.username);
    localStorage.setItem("token", response.token);
    localStorage.setItem("username", response.username);
    navigate("/workouts");
  };

  const register = async (usernameInput: string, password: string) => {
    await authService.register(usernameInput, password);
    // After successful registration, redirect to login page
    navigate("/login");
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
