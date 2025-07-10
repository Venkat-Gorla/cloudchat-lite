import { useQuery } from "@tanstack/react-query";
import { getConversationsForUser } from "../api/conversations";
import { useAuth } from "../context/AuthContext";

export default function useUserConversations() {
  const { getAccessToken } = useAuth();
  const accessToken = getAccessToken();
  const userId = "alice"; // vegorla TEMP hard-coded

  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => getConversationsForUser(accessToken, userId),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}
