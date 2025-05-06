import axios from "axios";

export const API_REQUEST_TIMEOUT = 5000;

export const WeatAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_REQUEST_TIMEOUT,
});
