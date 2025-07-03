import { callLambdaWithGet } from "./client.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Fetch a directory of users from Cognito via Lambda.
 * Requires access token from login flow.
 *
 * @param {string} accessToken - JWT access token
 * @returns {Promise<{ success: boolean, data: object[] | null, error: string | null }>}
 */
export async function getUserDirectory(accessToken) {
  const result = await callLambdaWithGet(ENDPOINTS.getUsers, {}, accessToken);

  if (!result.success) return result;

  return {
    success: true,
    data: result.data, // already formatted from Lambda
    error: null,
  };
}
