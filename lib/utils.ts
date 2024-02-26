import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
