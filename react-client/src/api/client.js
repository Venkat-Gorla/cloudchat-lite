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

// Optional: global error logging/redirects
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       console.error("Unauthorized, redirect to login?");
// Optional: window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

export default api;
