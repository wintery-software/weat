import axios from "axios";
import { APP_NAME } from "./constants";

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`${APP_NAME} API Error:`, error);

    return Promise.reject(error);
  },
);
