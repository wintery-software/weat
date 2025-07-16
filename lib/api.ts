import { APP_NAME } from "@/lib/constants";
import { APIError } from "@/types/types";
import axios, { isAxiosError } from "axios";

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message: string;
    const responseData = error.response
      ? (error.response.data as APIError)
      : undefined;

    if (isAxiosError(error) && responseData) {
      message = responseData.error;
    } else {
      message = (error as Error).message;
    }

    console.error(`${APP_NAME} API Error:`, message);

    return Promise.reject({ message });
  },
);

export const DEFAULT_FETCH_LIMIT = 20;
