import { defaultLocale } from '@/lib/i18n/i18n';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getWeatApiUrl = (
  route: string,
  params: URLSearchParams = new URLSearchParams(),
) => {
  let base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  if (base.endsWith('/')) {
    base = base.slice(0, -1);
  }

  if (!route.startsWith('/')) {
    throw new Error("Route must start with '/'");
  }

  const u = new URL(`${base}${route}`);
  u.search = params.toString();

  return u;
};

export type FetchWeatApiArgs = [
  route: string,
  locale?: string,
  params?: URLSearchParams,
];

export const fetchWeatApi = async <T>(...args: FetchWeatApiArgs) => {
  const [route, locale = defaultLocale, params] = args;

  const response = await fetch(getWeatApiUrl(route, params), {
    headers: {
      'Accept-Language': locale,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data as T;
};

// noinspection JSUnusedGlobalSymbols
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateMetadataTitle = (...values: string[]) =>
  `${values.join(' | ')} - Weat`;
