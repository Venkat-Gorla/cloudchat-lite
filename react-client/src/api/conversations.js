import { fetchMockConversationsForUser } from "./mock-conversations.js";

export async function fetchConversationsForUser(userId, delayMs = 500) {
  if (delayMs > 0) {
    await new Promise((res) => setTimeout(res, delayMs)); // simulate delay
  }

  return fetchMockConversationsForUser(userId);
}
