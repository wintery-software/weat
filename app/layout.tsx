import "./globals.css";
import { Providers } from "@/app/providers";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "@/lib/font";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Weat - Wintery Software",
  description: "What to eat today?",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(Inter.className, "antialiased")}>
        <Providers>
          <Navigation />
          {children}
          <Toaster richColors />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
