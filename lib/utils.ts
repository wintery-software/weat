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
