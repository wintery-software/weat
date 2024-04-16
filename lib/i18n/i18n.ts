// @ts-ignore
import { LocalePrefix } from 'next-intl/dist/types/src/shared/types';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'zh-CN'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localePrefix: LocalePrefix = 'as-needed';
export const languages: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '中文 (简体)',
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./translations/${locale}.json`)).default,
  };
});
