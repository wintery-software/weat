import { APP_NAME } from "@/lib/constants";
import axios, { isAxiosError } from "axios";

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
    let message: string;

    if (isAxiosError(error)) {
      message = error.message;
    } else {
      message = (error as Error).message;
    }

    console.error(`${APP_NAME} API Error:`, message);

    return Promise.reject({ message: (error as Error).message });
  },
);

export const DEFAULT_FETCH_LIMIT = 20;
