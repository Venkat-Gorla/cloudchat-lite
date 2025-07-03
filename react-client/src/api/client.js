import axios from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: access token via localStorage (disabled for security reasons)
// api.interceptors.request.use(...);

export default api;

// POST: optional access token to be added manually if needed
export async function callLambdaWithPost(endpoint, payload, accessToken) {
  try {
    const headers = createHeaders(accessToken);
    const res = await api.post(endpoint, payload, { headers });

    const parsed = parseSafeJSON(res.data);

    return {
      success: true,
      data: parsed,
      error: null,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
}

// GET variant for Lambda calls
export async function callLambdaWithGet(endpoint, params = {}, accessToken) {
  try {
    const headers = createHeaders(accessToken);
    const res = await api.get(endpoint, {
      params,
      headers,
    });

    const parsed = parseSafeJSON(res.data);

    return {
      success: true,
      data: parsed,
      error: null,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
}

// Consistent error formatting
export function createErrorResponse(error, fallback = "Request failed") {
  let message = fallback;

  try {
    let data = error?.response?.data;
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

function createHeaders(accessToken) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function parseSafeJSON(input) {
  return typeof input === "string" ? JSON.parse(input) : input;
}
