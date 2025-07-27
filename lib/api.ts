import { APP_NAME } from "@/lib/constants";
import axios, { isAxiosError } from "axios";

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const dataInfraApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DATA_INFRA_API_URL,
  headers: {
    "Content-Type": "application/json",
    // DO NOT MAKE THIS PUBLIC
    "x-api-key": process.env.DATA_INFRA_API_KEY as string,
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message: string;

    if (isAxiosError(error) && error.response?.data) {
      // Try to extract error message from API response
      const responseData = error.response.data as unknown;

      if (
        typeof responseData === "object" &&
        responseData !== null &&
        "error" in responseData
      ) {
        // API returned {error: string} format
        message = String(responseData.error);
      } else if (typeof responseData === "string") {
        // API returned plain string error
        message = responseData;
      } else {
        // Fallback to error message or status text
        message = error.message || error.response.statusText || "Unknown error";
      }
    } else {
      // Network error or other non-HTTP error
      message = (error as Error).message || "Network error";
    }

    console.error(`${APP_NAME} API Error:`, message);

    // Preserve the original AxiosError but add the extracted message
    if (isAxiosError(error)) {
      error.message = message;
    }

    return Promise.reject(error);
  },
);
