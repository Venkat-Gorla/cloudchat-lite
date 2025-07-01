import { AdminInitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import { AWS_REGION } from "../constants.js";

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

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const ISSUER = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`;

const client = jwksRsa.createRemoteJWKSet(
  new URL(`${ISSUER}/.well-known/jwks.json`)
);

export async function verifyToken(token) {
  const { header } = jwt.decode(token, { complete: true }) || {};
  if (!header?.kid) {
    throw new Error("Token header missing `kid`");
  }

  const key = await client({ kid: header.kid });

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      key,
      {
        issuer: ISSUER,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      }
    );
  });
}
