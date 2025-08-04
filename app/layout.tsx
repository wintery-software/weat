import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { APP_NAME, COMPANY_NAME } from "@/lib/constants/app";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
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

const winkyRough = localFont({
  src: "../public/fonts/WinkyRough-VariableFont_wght.ttf",
  variable: "--font-winky-rough",
});

export const metadata: Metadata = {
  title: `${APP_NAME} - ${COMPANY_NAME}`,
  description: "What to eat today?",
  icons: [
    {
      rel: "icon",
      url: "/weat-64x64.png",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${winkyRough.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
        <Toaster richColors closeButton />
      </body>
    </html>
  );
};

export default RootLayout;
