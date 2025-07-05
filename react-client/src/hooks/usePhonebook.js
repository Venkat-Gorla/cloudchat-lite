// src/hooks/usePhonebook.js
import { useAuth } from "../context/AuthContext";
import { getUserDirectory } from "../api/auth";

// memory-only cache for the session
let phonebook = null;
let fetched = false;

/**
 * Hook to retrieve and cache phonebook once per session.
 * Assumes accessToken is always available via AuthContext.
 *
 * @returns {Promise<object[]>} list of users
 */
export async function usePhonebook() {
  if (fetched) return phonebook;

  const { getAccessToken } = useAuth();
  const accessToken = getAccessToken(); // assumed always available

  const result = await getUserDirectory(accessToken);
  if (result.success) {
    phonebook = result.data;
    fetched = true;
    return phonebook;
  }

  throw new Error("Failed to fetch phonebook: " + result.error);
}
