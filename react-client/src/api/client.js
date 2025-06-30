import axios from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth token injection
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;

export async function callLambdaWithPost(endpoint, payload) {
  try {
    const res = await api.post(endpoint, payload);

    const parsed =
      typeof res.data === "string" ? JSON.parse(res.data) : res.data;

    return {
      success: true,
      data: parsed,
      error: null,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
}

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
