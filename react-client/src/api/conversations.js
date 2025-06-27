import { fetchMockConversationsForUser } from "./mock-conversations.js";

// vegorla: make this function async and update UI with spinning circle
export function fetchConversationsForUser(userId) {
  return fetchMockConversationsForUser(userId);
}
