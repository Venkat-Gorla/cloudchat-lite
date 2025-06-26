import {
  CognitoIdentityProviderClient,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AWS_REGION } from "../../constants.js";

const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.error("Usage: node admin-cli.js <username> <password>");
  process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region: AWS_REGION });

await client.send(
  new AdminSetUserPasswordCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
    Password: password,
    Permanent: true,
  })
);
