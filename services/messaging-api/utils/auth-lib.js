import { AdminInitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
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

const JWKS = jwksClient({
  jwksUri: `${ISSUER}/.well-known/jwks.json`,
  cache: true, // Optional, enables caching of JWKs
});

export async function verifyToken(token) {
  const decodedTokenHeader = jwt.decode(token, { complete: true });
  if (!decodedTokenHeader || !decodedTokenHeader.header?.kid) {
    throw new Error("Invalid or malformed token");
  }

  const keyId = decodedTokenHeader.header.kid;
  const signingKey = await createSigningKey(keyId);

  const payload = jwt.verify(token, signingKey, {
    issuer: ISSUER,
    algorithms: ["RS256"],
  });

  return payload;
}

function createSigningKey(keyId) {
  return new Promise((resolve, reject) => {
    JWKS.getSigningKey(keyId, (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key.getPublicKey());
      }
    });
  });
}
