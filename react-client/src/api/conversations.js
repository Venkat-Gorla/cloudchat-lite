import { callLambdaWithGet } from "./client.js";
import { ENDPOINTS } from "./endpoints.js";
import { formatConversationsForDisplay } from "./utils.js";

export const getConversationsForUser = async (accessToken, userId) => {
  const result = await callLambdaWithGet(
    ENDPOINTS.getConversations,
    {},
    accessToken
  );

  // vegorla: how to integrate this error with UI?
  if (!result.success) {
    throw new Error(result.error || "Failed to load conversations");
  }

  const conversations = result.data || [];
  if (conversations.length === 0) return [];

  return formatConversationsForDisplay(conversations, userId);
};
