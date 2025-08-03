import axios from "axios";

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const dataApi = axios.create({
  baseURL: process.env.WEAT_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.WEAT_API_KEY,
  },
});

// dataApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (!isAxiosError(error)) {
//       return Promise.reject({ error: error.message });
//     }
//
//     switch (error.status) {
//       case 400:
//         return Promise.reject({ error: "Bad Request" });
//       case 401:
//         return Promise.reject({ error: "Unauthorized" });
//       case 403:
//         return Promise.reject({ error: "Forbidden" });
//       default:
//         return Promise.reject(error);
//     }
//   },
// );
