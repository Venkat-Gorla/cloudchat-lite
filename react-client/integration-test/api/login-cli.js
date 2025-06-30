import { loginUser } from "../../src/api/auth.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: node login-cli.js <username> <password>");
  process.exit(1);
}

(async () => {
  const result = await loginUser(username, password);

  if (result.success) {
    console.log("Login successful");
    console.log("Access Token:", result.data.accessToken);
    console.log("\nID Token:", result.data.idToken);
    console.log("\nRefresh Token:", result.data.refreshToken);
  } else {
    console.error("Login failed:", result.error);
    process.exit(1);
  }
})();
