import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export const getGoogleChromeURLScheme = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const href = window.location.href;
  return `googlechrome://${href.substring(href.indexOf("://") + 3)}`;
};

/**
 * Sleep for a specified number of milliseconds.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getLastUpdatedTimestamp = (data: Place[]) => {
  const timestamps = data.map((place) => place.updatedAt);
  return Math.max(...timestamps);
};

/**
 * Convert a timestamp to a human-readable date string.
 *
 * @param timestamp The timestamp to convert
 * @returns A date string
 */
export const timestampToDateString = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
