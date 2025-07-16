import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { APP_NAME, COMPANY_NAME } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} - ${COMPANY_NAME}`,
  description: "What to eat today?",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
        <Toaster richColors />
      </body>
    </html>
  );
};

export default RootLayout;
