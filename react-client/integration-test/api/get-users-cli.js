import { loginUser } from "../../src/api/auth.js";
import { getUserDirectory } from "../../src/api/users.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: node get-users-cli.js <username> <password>");
  process.exit(1);
}

async function handleFetchUsers() {
  const loginResult = await loginUser(username, password);
  if (!loginResult.success) {
    console.error("Login failed:", loginResult.error);
    process.exit(1);
  }

  console.log("Login successful");
  const { accessToken } = loginResult.data;
  const fetchUsersResult = await getUserDirectory(accessToken);
  if (!fetchUsersResult.success) {
    console.error("Failed to fetch users:", fetchUsersResult.error);
    process.exit(1);
  }

  console.log("Users fetched successfully");
  console.log("Users:", fetchUsersResult.data);
}

(async () => {
  await handleFetchUsers();
  process.exit(0);
})();
