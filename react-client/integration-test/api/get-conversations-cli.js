import { loginUser } from "../../src/api/auth.js";
import { getConversationsForUser } from "../../src/api/conversations.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: node get-conversations-cli.js <username> <password>");
  process.exit(1);
}

async function handleFetchConversations() {
  const loginResult = await loginUser(username, password);
  if (!loginResult.success) {
    console.error("Login failed:", loginResult.error);
    process.exit(1);
  }

  console.log("Login successful");
  const { accessToken } = loginResult.data;
  const fetchConvosResult = await getConversationsForUser(accessToken);
  if (!fetchConvosResult.success) {
    console.error("Failed to fetch conversations:", fetchConvosResult.error);
    process.exit(1);
  }

  console.log("Conversations fetched successfully");
  console.log("Conversations:", fetchConvosResult.data);
}

(async () => {
  await handleFetchConversations();
  process.exit(0);
})();
