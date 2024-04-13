import { defaultLocale, localePrefix, locales } from '@/lib/i18n/i18n';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|zh-CN)/:path*'],
};
