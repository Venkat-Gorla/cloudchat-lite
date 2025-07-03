import axios from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: access token via localStorage (disabled for security reasons)
// api.interceptors.request.use(...);

// Main unified Lambda caller
async function callLambda(method, endpoint, options = {}, accessToken) {
  try {
    const headers = createHeaders(accessToken);

    const response = await api.request({
      method,
      url: endpoint,
      headers,
      ...options,
    });

    const parsed = parseSafeJSON(response.data);

    return {
      success: true,
      data: parsed,
      error: null,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
}

export const callLambdaWithPost = (endpoint, payload, accessToken) =>
  callLambda("post", endpoint, { data: payload }, accessToken);

export const callLambdaWithGet = (endpoint, queryParams = {}, accessToken) =>
  callLambda("get", endpoint, { params: queryParams }, accessToken);

// Utility: builds Authorization headers
function createHeaders(accessToken) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

// Utility: safe JSON parsing
function parseSafeJSON(input) {
  if (typeof input !== "string") return input;
  try {
    return JSON.parse(input);
  } catch {
    return input;
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

export default api;
