import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class values into a single string.
 * @param inputs - The class values to merge
 * @returns The merged class string
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Get an environment variable.
 * @param key - The environment variable key
 * @param defaultValue - The default value to return if the environment variable is not set
 * @returns The environment variable value
 */
export const env = (key: string, defaultValue?: string) => {
  const value = process.env[key];

  if (value === undefined || value === null) {
    if (!defaultValue) {
      throw new Error(`Environment variable is not set: ${key}`);
    }

    return defaultValue;
  }

  return value;
};
