import { createContext, useContext, useState, useRef } from "react";
import { loginUser } from "../api/auth.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const accessTokenRef = useRef(null);

  const login = async ({ username, password }) => {
    const result = await loginUser(username, password);
    if (result.success) {
      accessTokenRef.current = result.data.accessToken;
      setIsAuthenticated(true);
    }
    return result; // return { success, data, error }
  };

  const logout = () => {
    accessTokenRef.current = null;
    setIsAuthenticated(false);
  };

  const getAccessToken = () => accessTokenRef.current;

  const contextValue = { isAuthenticated, login, logout, getAccessToken };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
