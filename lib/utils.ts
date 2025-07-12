import { APP_NAME } from "@/lib/constants";
import { Address } from "@/types/types";
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
 * Sleep for a given number of milliseconds.
 * @param ms - The number of milliseconds to sleep
 * @returns A promise that resolves after the given number of milliseconds
 */
export const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

/**
 * Format an address object into a string.
 *
 * For example, if the address is:
 *
 * ```json
 * {
 *   address_1: "123 Main St",
 *   address_2: "Apt 4B",
 *   city: "Santa Clara",
 *   state: "CA",
 *   zip_code: "95050"
 * }
 * ```
 *
 * The formatted address will be:
 * "123 Main St Apt 4B, Santa Clara, CA 95050"
 *
 * @param address - The address object to format
 * @returns The formatted address string
 */
export const formatAddress = (address: Address | null | undefined) => {
  if (!address) {
    return "";
  }

  let result = address.address_1;

  if (address.address_2) {
    // No comma before address_2
    result += ` ${address.address_2}`;
  }

  result += `, ${address.city}, ${address.state} ${address.zip_code}`;

  return result;
};

/**
 * Generate a title for the page: "[title] - [APP_NAME]"
 * @param title - The title of the page
 * @returns The generated title
 */
export const generateTitle = (title: string) => `${title} - ${APP_NAME}`;
