import { useQuery } from "@tanstack/react-query";
import { fetchConversationsForUser } from "../api/conversations";

// vegorla: custom hook unit tests
export default function useUserConversations(userId) {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => fetchConversationsForUser(userId),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}
