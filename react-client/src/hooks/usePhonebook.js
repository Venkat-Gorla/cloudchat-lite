// src/hooks/usePhonebook.js
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserDirectory } from "../api/users.js";

/**
 * Hook to fetch and cache phonebook once per session.
 * Assumes accessToken is always available via AuthContext.
 *
 * @returns {{ data: object[] | null, error: string | null, isLoading: boolean }}
 */
export function usePhonebook() {
  const { getAccessToken } = useAuth();
  const phonebookRef = useRef(null);
  const fetchedRef = useRef(false);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!fetchedRef.current);

  useEffect(() => {
    if (fetchedRef.current) {
      setData(phonebookRef.current);
      setIsLoading(false);
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      setError("Missing access token");
      setIsLoading(false);
      return;
    }

    getUserDirectory(accessToken).then((result) => {
      if (result.success) {
        phonebookRef.current = result.data;
        fetchedRef.current = true;
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch users");
        setData(null);
      }
      setIsLoading(false);
    });
  }, [getAccessToken]);

  return { data, error, isLoading };
}
