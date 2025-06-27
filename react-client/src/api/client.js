// src/api/client.js
// vegorla: this is general purpose client code for calling Lambda, we will
// have to make changes for our specific case
import axios from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: global error logging/redirects
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.error("Unauthorized, redirect to login?");
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// src/api/conversations.js
import api from "./client";

const LAMBDA_CONVERSATION_URL = "https://your-lambda-url.aws-region.on.aws/";

function getConversationsForUser(userId) {
  return api.post(LAMBDA_CONVERSATION_URL, { userId });
}

// src/api/messages.js
import api from "./client";

const LAMBDA_MESSAGES_URL =
  "https://your-messages-lambda-url.aws-region.on.aws/";

function fetchMessages(conversationId) {
  return api.post(LAMBDA_MESSAGES_URL, { conversationId });
}

// src/api/users.js
import api from "./client";

const LAMBDA_USERS_URL = "https://your-users-lambda-url.aws-region.on.aws/";

function getUserDirectory() {
  return api.get(LAMBDA_USERS_URL);
}

// Optional: src/api/endpoints.js
export const ENDPOINTS = {
  getConversations: "https://your-lambda-url.aws-region.on.aws/",
  getMessages: "https://your-messages-lambda-url.aws-region.on.aws/",
  getUsers: "https://your-users-lambda-url.aws-region.on.aws/",
};
