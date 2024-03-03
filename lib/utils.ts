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

export const fetchWeatApi = async (
  input: string,
  params?: URLSearchParams,
  init?: RequestInit,
) => {
  const url = new URL(
    `/api/${input.startsWith('/') ? input.slice(1) : input}`,
    process.env.NEXT_PUBLIC_API_URL,
  );

  if (params) {
    url.search = params.toString();
  }

  const response = await fetch(url, init);
  return response.json();
};

export const search = async (
  query: string,
  limit?: number,
  ...props: any[]
) => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (limit) params.append('limit', limit.toString());

  const url = `/api/search?${params}`;
  const response = await fetch(url, ...props);

  return response.json();
};

export const normalize = (str: string) =>
  str.toLowerCase().replaceAll(/\W/g, '');

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
