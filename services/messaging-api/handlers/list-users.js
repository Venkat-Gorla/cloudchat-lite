import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AWS_REGION, CORS_HEADERS } from "../constants.js";
import { validateAccessToken } from "../utils/auth-lib.js";

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

// TODO consider rate limiting for Lambda
export const handler = async (event) => {
  const { success, tokenData, errorHttpResponse } = await authenticateRequest(
    event.headers
  );
  if (!success) return errorHttpResponse;

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

async function authenticateRequest(headers = {}) {
  const token = extractAccessToken(headers);
  if (!token) {
    return {
      success: false,
      errorHttpResponse: {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: "Missing or invalid Authorization header",
        }),
      },
    };
  }

  const { success, data, error } = await validateAccessToken(token);
  if (!success) {
    return {
      success: false,
      errorHttpResponse: {
        statusCode: 403,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error }),
      },
    };
  }

  return {
    success: true,
    tokenData: data,
  }; // authenticated successfully, continue
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
