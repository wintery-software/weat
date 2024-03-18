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

export const getWeatApiUrl = (route: string, params?: URLSearchParams) => {
  if (route.startsWith('/')) {
    route = route.slice(1);
  }

  const u = new URL(`${process.env.NEXT_PUBLIC_API_URL}/${route}`);

  if (params) {
    u.search = params.toString();
  }

  return u;
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
