// vegorla: hook for token management: login, store, refresh?

import { createContext, useContext, useState } from "react";
import { loginUser } from "../api/auth.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async ({ username, password }) => {
    const result = await loginUser(username, password);
    if (result.success) {
      setIsAuthenticated(true);
    }
    return result; // return { success, data, error }
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
