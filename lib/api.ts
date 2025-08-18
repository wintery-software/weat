import { type APIError } from "@/types/types";
import axios, { type AxiosError } from "axios";

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

dataApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error(
      "Weat API error:",
      error.config?.method?.toUpperCase(),
      new URL(error.config?.url ?? "", error.config?.baseURL).href,
      error.response?.status,
      (error.response?.data as APIError).error,
    );

    switch (error.response?.status) {
      case 400:
        return Promise.reject(new Error("Bad Request"));
      case 401:
        return Promise.reject(new Error("Unauthorized"));
      case 403:
        return Promise.reject(new Error("Forbidden"));
      case 404:
        return Promise.reject(new Error("Not Found"));
      default:
        return Promise.reject(error);
    }
  },
);
