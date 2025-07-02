import { handler } from "../../handlers/login.js";
import { verifyToken } from "../../utils/auth-lib.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: node login-cli.js <username> <password>");
  process.exit(1);
}

const event = {
  body: JSON.stringify({ username, password }),
};

(async () => {
  try {
    const result = await handler(event);
    const body = JSON.parse(result.body);

    if (result.statusCode === 200) {
      console.log("Login successful");
      await printTokens(body);
    } else {
      console.error("Login failed:", body.error);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
})();

async function printTokens(body) {
  const idPayload = await verifyToken(body.idToken);
  console.log("\nDecoded idToken:", idPayload);

  const accessPayload = await verifyToken(body.accessToken);
  console.log("\nDecoded accessToken:", accessPayload);

  // note: refresh token is opaque and cannot be verified or decoded
}
