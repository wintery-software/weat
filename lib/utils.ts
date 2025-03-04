import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchWeatAPI = async <T = never>(
  input: string | URL | Request,
  init?: RequestInit,
) => {
  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    throw new Error("APP_URL is not set.");
  }

  console.log(`URL: ${appUrl}/${input}`);

  try {
    const res = await fetch(`${appUrl}/${input}`, init);
    return (await res.json()) as T;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

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

/**
 * Get the date of the last update from a list of places.
 * If the list is empty, return "N/A".
 *
 * @param data List of places
 * @returns Date of the last update
 */
export const getLastUpdated = (data: Place[]) => {
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
