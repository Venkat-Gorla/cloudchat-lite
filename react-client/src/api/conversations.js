import { callLambdaWithGet } from "./client.js";
import { ENDPOINTS } from "./endpoints.js";
import { fetchMockConversationsForUser } from "./mock-conversations.js";

export async function fetchConversationsForUser(userId, delayMs = 500) {
  if (delayMs > 0) {
    await new Promise((res) => setTimeout(res, delayMs)); // simulate delay
  }

  // if you want to simulate failure and the test the UI
  // return Promise.reject(new Error("Simulated network failure"));

  return fetchMockConversationsForUser(userId);
}

export const getConversationsForUser = (accessToken) =>
  callLambdaWithGet(ENDPOINTS.getConversations, {}, accessToken);
