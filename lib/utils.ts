import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const search = async (query: string, type?: string, ...props: any[]) => {
  const response = await fetch(`http://localhost:3000/api/search?q=${query}&type=${type}`, ...props);
  return response.json();
};
