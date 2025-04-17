import axios from "axios";

export const frontendAPI = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const backendAPI = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
