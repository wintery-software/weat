import { APP_NAME } from "@/lib/constants";
import { kilometersToMiles } from "@/lib/navigation";
import { type DistanceUnit, type Place } from "@/types/types";
import { type ClassValue, clsx } from "clsx";
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
 * Accepts a Place object (which has all address fields).
 *
 * @param place - The place object to format
 * @returns The formatted address string
 */
export const formatAddress = (place?: Place) => {
  if (!place) {
    return "";
  }

  let result = place.address_1;

  if (place.address_2) {
    // No comma before address_2
    result += ` ${place.address_2}`;
  }

  result += `, ${place.city}, ${place.state} ${place.zip_code}`;

  return result;
};

/**
 * Generate a title for the page: "[title] - [APP_NAME]"
 * @param title - The title of the page
 * @returns The generated title
 */
export const generateTitle = (title: string) => `${title} - ${APP_NAME}`;

export const formatDistance = (meters: number, unit: DistanceUnit) => {
  if (unit === "imperial") {
    // Convert meters to kilometers, then to miles
    const kilometers = meters / 1000;
    const miles = kilometersToMiles(kilometers);

    return Number(miles.toFixed(2));
  } else {
    // Metric: return kilometers
    return Number((meters / 1000).toFixed(2));
  }
};
