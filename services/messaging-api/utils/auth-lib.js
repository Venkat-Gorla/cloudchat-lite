import { AdminInitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export function createAuthCommand(event) {
  const clientId = process.env.COGNITO_CLIENT_ID;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;

  if (!clientId) {
    throw new Error("COGNITO_CLIENT_ID environment variable is not set");
  }

  if (!userPoolId) {
    throw new Error("COGNITO_USER_POOL_ID environment variable is not set");
  }

  const body = JSON.parse(event.body);
  const { username, password } = body;

  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  return new AdminInitiateAuthCommand({
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    ClientId: clientId,
    UserPoolId: userPoolId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });
}
