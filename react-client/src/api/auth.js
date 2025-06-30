import { callLambdaWithPost } from "./client.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Call login Lambda with credentials. Always returns { success, data, error }.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function loginUser(username, password) {
  const result = await callLambdaWithPost(ENDPOINTS.login, {
    username,
    password,
  });

  if (!result.success) return result;

  const { accessToken, idToken, refreshToken } = result.data;

  return {
    success: true,
    data: { accessToken, idToken, refreshToken },
    error: null,
  };
}
