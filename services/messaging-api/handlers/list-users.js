import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AWS_REGION, CORS_HEADERS } from "../constants.js";
import { authenticateRequest } from "../utils/auth-lib.js";

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
      body: JSON.stringify({ error: err.message }),
    };
  }
};

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
