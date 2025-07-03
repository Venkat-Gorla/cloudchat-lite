import { handler as listUsersLambda } from "../../handlers/list-users.js";
import { handler as login } from "../../handlers/login.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: node list-users-cli.js <username> <password>");
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
      console.log("Login successful, getting user directory");
      await listUsers(body.accessToken);
    } else {
      console.error("Login failed:", body.error);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
})();

async function listUsers(accessToken) {
  const listUsersEvent = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const res = await listUsersLambda(listUsersEvent);
  console.log("\nStatus:", res.statusCode);
  console.log("Users:");
  console.log(JSON.stringify(JSON.parse(res.body), null, 2));
}
