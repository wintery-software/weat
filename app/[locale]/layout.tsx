import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Viewport } from 'next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../styles/weat.css';
import { ReactNode } from 'react';

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
    title: t('pages.home.metadata.name'),
    description: t('pages.home.metadata.description'),
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
        className={cn(
          inter.className,
          'flex min-h-screen w-full flex-col bg-muted/40',
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <SpeedInsights />
        <Toaster closeButton richColors />
      </body>
    </html>
  );
};

export default RootLayout;
