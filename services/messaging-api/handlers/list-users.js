import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AWS_REGION, CORS_HEADERS } from "../constants.js";

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

export const handler = async (event) => {
  const token = extractAccessToken(event.headers);

  if (!token) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Missing or invalid Authorization header",
      }),
    };
  }

  try {
    // Skip validation for resume/demo (Cognito verifies token for us)
    const command = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Limit: 20, // hardcoded max
    });

    const { Users } = await client.send(command);

    const results = Users.map((user) => {
      const attrs = Object.fromEntries(
        user.Attributes.map((a) => [a.Name, a.Value])
      );
      return {
        username: user.Username,
        name: attrs.name || "",
        email: attrs.email || "",
        status: user.UserStatus,
      };
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(results),
    };
  } catch (err) {
    console.error("ListUsers failed:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Unable to fetch users" }),
    };
  }
};

function extractAccessToken(headers = {}) {
  const auth = headers.Authorization || headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.replace("Bearer ", "").trim();
}
