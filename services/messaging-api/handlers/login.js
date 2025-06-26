import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { createAuthCommand } from "../utils/auth-lib.js";
import { AWS_REGION, CORS_HEADERS } from "../constants.js";

const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_REGION,
});

export const handler = async (event) => {
  try {
    const command = createAuthCommand(event);
    const response = await cognitoClient.send(command);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        accessToken: response.AuthenticationResult?.AccessToken,
        idToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
      }),
    };
  } catch (err) {
    console.error("Login failed:", err);
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
