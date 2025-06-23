import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();
const LOCAL_KEY = "yapple_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem(LOCAL_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setUser(parsed);
        console.log('[AuthContext] Loaded user from localStorage:', parsed);
      } catch (e) {
        setUser(null);
        console.error('[AuthContext] Failed to parse user from localStorage:', e);
      }
    }
  }, []);

  const login = ({ email, password, role }) => {
    const jwt = btoa(`${email}:${role}:${Date.now()}`);
    const userData = { email, role, jwt };
    setUser(userData);
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(userData));
      console.log('[AuthContext] Login successful:', userData);
      toast.success(
        `Welcome back, ${email}!`, 
        {
          className: 'bg-green-50 text-green-800 border border-green-500',
          duration: 3000,
        }
      );
    } catch (e) {
      console.error('[AuthContext] Failed to write to localStorage:', e);
      toast.error(
        'Login failed. Please try again.',
        {
          className: 'bg-red-50 text-red-800 border border-red-500',
          duration: 3000,
        }
      );
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(LOCAL_KEY);
      console.log('[AuthContext] Logged out, localStorage cleared');
      toast.success(
        'You have been logged out successfully', 
        {
          className: 'bg-green-50 text-green-800 border border-green-500',
          duration: 3000,
        }
      );
    } catch (e) {
      console.error('[AuthContext] Failed to clear localStorage:', e);
      toast.error(
        'Logout failed. Please try again.',
        {
          className: 'bg-red-50 text-red-800 border border-red-500',
          duration: 3000,
        }
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
