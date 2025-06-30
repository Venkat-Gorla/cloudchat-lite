import api from "./client.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Call login Lambda with credentials. Always returns { success, data, error }.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function loginUser(username, password) {
  try {
    const res = await api.post(ENDPOINTS.login, { username, password });

    const parsed =
      typeof res.data === "string" ? JSON.parse(res.data) : res.data;

    return {
      success: true,
      data: {
        accessToken: parsed.accessToken,
        idToken: parsed.idToken,
        refreshToken: parsed.refreshToken,
      },
      error: null,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
}

function createErrorResponse(error) {
  let message = "Login failed";

  try {
    let data = error?.response?.data;

    // Parse if data is still a stringified JSON
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    message = data?.error || error?.message || message;
  } catch {
    message = error?.message || message;
  }

  return {
    success: false,
    data: null,
    error: message,
  };
}
