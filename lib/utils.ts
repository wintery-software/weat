import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const env = (key: string, defaultValue?: string) => {
  const value = process.env[key];
  if (value) return value;
  if (defaultValue) return defaultValue;
  throw new Error(`Missing environment variable: ${key}`);
};

export const fetcher = async (input: string, init?: RequestInit) => {
  if (input.startsWith('/')) {
    input = input.slice(1);
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${input}`, init);

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // @ts-ignore
    error.info = await res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const getWeatApiUrl = (
  route: string,
  locale?: string,
  params?: URLSearchParams,
) => {
  if (route.startsWith('/')) route = route.slice(1);
  const u = new URL(`${process.env.NEXT_PUBLIC_API_URL}/${route}`);
  params ||= new URLSearchParams();
  if (locale) params.set('locale', locale);
  u.search = params.toString();
  return u;
};

export const fetchWeatApi = async <T>(
  route: string,
  locale?: string,
  params?: URLSearchParams,
) => {
  const response = await fetch(getWeatApiUrl(route, locale, params));
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data as T;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateMetadataTitle = (...values: string[]) =>
  `${values.join(' | ')} - Weat`;

export const getPlaceholderImage = (width: number, height?: number) => {
  let size = width.toString();
  if (height) size += `x${height}`;
  return `https://via.placeholder.com/${size}`;
};
