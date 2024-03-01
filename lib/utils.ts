import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchWeatApi = async (
  input: string,
  params?: string | URLSearchParams,
  init?: RequestInit,
) => {
  let url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error('API URL is not defined');
  }

  if (!input.startsWith('/')) {
    url += '/';
  }

  url += `/${input}`;

  if (params) {
    url += `?${params}`;
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
