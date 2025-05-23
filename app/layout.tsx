import "./globals.css";
import { Providers } from "@/app/providers";
import { DynamicBanner } from "@/components/dynamic-banner";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_TOAST_DURATION } from "@/lib/constants";
import { Inter } from "@/lib/font";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { type ReactNode } from "react";
import "react-circular-progressbar/dist/styles.css";

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
      <body className={cn(Inter.className, "flex min-h-screen flex-col antialiased")}>
        <Providers>
          <DynamicBanner />
          <Navigation />
          <div className="flex flex-1">{children}</div>
          <Toaster richColors toastOptions={{ duration: DEFAULT_TOAST_DURATION }} />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
