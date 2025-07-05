import { clsx, type ClassValue } from "clsx";
import dotenv from "dotenv";
import { twMerge } from "tailwind-merge";

// Load environment variables from .env file
dotenv.config();

/**
 * Merge class values into a single string.
 * @param inputs - The class values to merge
 * @returns The merged class string
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Get an environment variable and throw an error if it is not set.
 * @param key - The environment variable key
 * @returns The environment variable value
 */
export const env = (key: string) => {
  const value = process.env[key];

  if (value === undefined || value === null) {
    throw new Error(`Environment variable is not set: ${key}`);
  }

  return value;
};
