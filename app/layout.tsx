import SWRProvider from '@/app/providers/swr-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './weat.css';
import { ReactNode, Suspense } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: '今天吃什么',
  description: '然后你就知道今天吃什么',
};

// noinspection JSUnusedGlobalSymbols
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.className, 'bg-stone-50 min-h-screen antialiased')}
      >
        <SWRProvider>
          <Suspense>{children}</Suspense>
          <SpeedInsights />
          <Toaster closeButton richColors />
        </SWRProvider>
      </body>
    </html>
  );
}
