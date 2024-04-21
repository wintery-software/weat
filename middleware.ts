import { defaultLocale, localePrefix, locales } from '@/lib/i18n/i18n';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  // Matcher entries are linked with a logical "or", therefore
  // if one of them matches, the middleware will be invoked.
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … if they start with `/monitoring` (Sentry.io)
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|monitoring|.*\\..*).*)',
  ],
};
