import { handler as login } from "../../handlers/login.js";
import { getConversationsForUser } from "../../handlers/get-conversations.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: node get-conversations-cli.js <username> <password>");
  process.exit(1);
}

const loginEvent = {
  body: JSON.stringify({ username, password }),
};

(async () => {
  try {
    const result = await login(loginEvent);
    const body = JSON.parse(result.body);

    if (result.statusCode === 200) {
      console.log("Login successful, getting user conversations");
      await getConversations(body.accessToken);
    } else {
      console.error("Login failed:", body.error);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
})();

async function getConversations(accessToken) {
  const conversationsEvent = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const res = await getConversationsForUser(conversationsEvent);
  console.log("\nStatus:", res.statusCode);
  console.log("Conversations:");
  console.log(JSON.stringify(JSON.parse(res.body), null, 2));
}
