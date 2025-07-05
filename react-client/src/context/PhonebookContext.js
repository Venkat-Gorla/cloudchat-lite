// src/context/PhonebookContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getUserDirectory } from "../api/users.js";

const PhonebookContext = createContext();

export function PhonebookProvider({ children }) {
  const { getAccessToken } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setError("Missing access token");
      setIsLoading(false);
      return;
    }

    getUserDirectory(accessToken).then((result) => {
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setData(null);
        setError(result.error || "Failed to fetch users");
      }
      setIsLoading(false);
    });
  }, [getAccessToken]);

  return (
    <PhonebookContext.Provider value={{ data, error, isLoading }}>
      {children}
    </PhonebookContext.Provider>
  );
}

export function usePhonebook() {
  return useContext(PhonebookContext);
}
