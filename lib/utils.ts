import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

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
export const sleep = (ms: number) => {
  // Don't sleep in non-dev mode
  // https://github.com/wintery-software/weat/commit/ec7a79c82024f6f337aaf56d9a943cbd70bc9766
  if (process.env.NODE_ENV !== "development") {
    return Promise.resolve();
  }

  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Capitalize the first letter of a string.
 *
 * @param s The string to capitalize.
 * @returns The capitalized string.
 */
export const capitalize = (s: string) => {
  if (s.length === 0) {
    return s;
  }

  return s.charAt(0).toUpperCase() + s.slice(1);
};
