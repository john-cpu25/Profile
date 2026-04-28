"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authApi, profileApi } from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const profile = await profileApi.getMe();
        setUser(profile);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const data = await authApi.login(username, password);
      localStorage.setItem("token", data.access_token);
      await checkUser();
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Login failed (Backend might be offline)";
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
