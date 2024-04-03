import SWRProvider from '@/app/providers/swr-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Viewport } from 'next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../styles/weat.css';
import { ReactNode, Suspense } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export interface I18nProps {
  locale: string;
}

export const generateMetadata = async ({
  params: { locale },
}: {
  params: I18nProps;
}) => {
  const t = await getTranslations({ locale });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
};

// noinspection JSUnusedGlobalSymbols
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({
  children,
  params: { locale },
}: Readonly<{
  children: ReactNode;
  params: I18nProps;
}>) => {
  const messages = useMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(inter.className, 'bg-stone-50 min-h-screen antialiased')}
      >
        <Suspense>
          <SWRProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </SWRProvider>
        </Suspense>
        <SpeedInsights />
        <Toaster closeButton richColors />
      </body>
    </html>
  );
};

export default RootLayout;
