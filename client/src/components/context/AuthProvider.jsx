import { useState, useEffect } from "react";
import { apiFetch } from "../api/apiFetch";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const _ = await apiFetch("api/token/refresh/", {
          method: "POST",
        });

        const me = await apiFetch("api/profile/", {
          method: "GET",
        });

        // using profile endpoint to get user details instead of token refresh response
        setUser({ email: me.user.email, name: me.user.name });
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
        setUser({ email: data.user.email, name: data.user.name });
        return data;
      } else {
        throw new Error(data?.message || "Login failed");
      }
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiFetch("api/logout/", {
        method: "POST",
      });
      setUser(null); // clear user state
      toast.success("Logout successful!");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
