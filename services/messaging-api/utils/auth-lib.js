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

/**
 * Validates the access token and extracts structured info
 * @param {string} token - JWT access token
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function validateAccessToken(token) {
  if (!token || typeof token !== "string" || token.split(".").length !== 3) {
    return {
      success: false,
      data: null,
      error: "Invalid token format",
    };
  }

  try {
    const payload = await verifyToken(token);

    if (!payload || !payload.scope?.includes("aws.cognito.signin.user.admin")) {
      return {
        success: false,
        data: null,
        error: "Invalid or unauthorized token",
      };
    }

    const username = payload["cognito:username"] || payload.username;

    return {
      success: true,
      data: {
        username,
        sub: payload.sub,
        scope: payload.scope,
      },
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      error: `Token verification failed: ${err.message}`,
    };
  }
}

export async function authenticateRequest(headers = {}) {
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
