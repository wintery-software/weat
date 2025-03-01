import "./globals.css";
import { Providers } from "@/app/providers";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Analytics } from "@vercel/analytics/react";
import { BananaIcon } from "lucide-react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { type ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weat - Wintery Software",
  description: "What to eat today?",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#0a0a0a",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased",
          "flex",
          "flex-col",
          "w-dvh",
          "h-dvh",
        )}
      >
        <Providers>
          <Navigation>
            <Button
              variant="ghost"
              asChild
              className="font-bold hover:bg-background"
            >
              <Link href="/">
                <BananaIcon />
                Weat
              </Link>
            </Button>
            <div className="ml-auto px-2">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href="https://github.com/wintery-software/weat"
                    target="_blank"
                  >
                    <SiGithub />
                  </Link>
                </Button>
                {/*<ThemeToggle />*/}
              </div>
            </div>
          </Navigation>
          <div className="grow">{children}</div>
          <Toaster richColors />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
