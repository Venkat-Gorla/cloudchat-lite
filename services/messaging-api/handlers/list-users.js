import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AWS_REGION, CORS_HEADERS } from "../constants.js";
import { validateAccessToken } from "../utils/auth-lib.js";

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

// TODO consider rate limiting for Lambda
export const handler = async (event) => {
  const authResult = await authenticateRequest(event.headers);
  if (authResult) return authResult;

  try {
    const command = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Limit: 20, // hardcoded max
    });

    const { Users } = await client.send(command);
    const results = extractResults(Users);

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

// TODO: the contract of this function should be modified for generic Lambda
// integration; it should return extracted token data: username etc.
// suggestion: { success, tokenData, errorHttpResponse }
async function authenticateRequest(headers = {}) {
  const token = extractAccessToken(headers);
  if (!token) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Missing or invalid Authorization header",
      }),
    };
  }

  const { success, data, error } = await validateAccessToken(token);
  if (!success) {
    return {
      statusCode: 403,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error }),
    };
  }

  return null; // authenticated successfully, continue
}

function extractAccessToken(headers = {}) {
  const auth = headers.Authorization || headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.replace("Bearer ", "").trim();
}

function extractResults(Users) {
  return Users.map((user) => {
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
}
