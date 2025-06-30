import api from "./client";
import { fetchMockConversationsForUser } from "./mock-conversations.js";

export async function fetchConversationsForUser(userId, delayMs = 500) {
  if (delayMs > 0) {
    await new Promise((res) => setTimeout(res, delayMs)); // simulate delay
  }

  // if you want to simulate failure and the test the UI
  // return Promise.reject(new Error("Simulated network failure"));

  return fetchMockConversationsForUser(userId);
}

const LAMBDA_CONVERSATION_URL = "https://your-lambda-url.aws-region.on.aws/";

function getConversationsForUser(userId) {
  return api.post(LAMBDA_CONVERSATION_URL, { userId });
}
