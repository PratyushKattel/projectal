import { useState, useEffect } from "react";
import { apiFetch } from "../api/apiFetch";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await apiFetch("/api/token/refresh", {
          method: "POST",
        });
        console.log(data);
      } catch (error) {
        setUser(null);
        console.log("ERROR :", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (name, email, password) => {
    const data = await apiFetch("api/register/", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    return data;
  };

  const login = async (email, password) => {
    try {
      const data = await apiFetch("api/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data) {
        setUser({ email });
        return data;
      } else {
        throw new Error(data?.message || "Login failed");
      }
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login }}>
      {children}
    </AuthContext.Provider>
  );
};
