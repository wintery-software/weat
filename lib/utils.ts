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
  if (!data || data.length === 0) {
    return "N/A";
  }

  let latestDate = new Date(0); // Start with the earliest possible date

  for (let i = 0; i < data.length; i++) {
    const currentDate = new Date(data[i].updatedAt);
    if (currentDate > latestDate) {
      latestDate = currentDate;
    }
  }

  return latestDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
