import { useQuery } from "@tanstack/react-query";
import { getConversationsForUser } from "../api/conversations";
import { useAuth } from "../context/AuthContext";

export default function useUserConversations() {
  const { getAccessToken, getUserId } = useAuth();
  const accessToken = getAccessToken();
  const userId = getUserId();

  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => getConversationsForUser(accessToken, userId),
    enabled: !!userId && !!accessToken,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}
