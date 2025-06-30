import api from "./client";

const LAMBDA_MESSAGES_URL =
  "https://your-messages-lambda-url.aws-region.on.aws/";

function fetchMessages(conversationId) {
  return api.post(LAMBDA_MESSAGES_URL, { conversationId });
}
