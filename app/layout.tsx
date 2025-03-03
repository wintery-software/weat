import "./globals.css";
import { Providers } from "@/app/providers";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/ui/kibo-ui/announcement";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LucideArrowUpRight, LucideBanana } from "lucide-react";
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
  const announcementMessage = process.env.ANNOUNCEMENT_MESSAGE;
  const announcementUrl = process.env.ANNOUNCEMENT_URL;
  const showAnnouncement = announcementMessage && announcementUrl;

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
                <LucideBanana />
                Weat
              </Link>
            </Button>
            {/* Right side */}
            <div className="ml-auto flex items-center gap-2 px-2">
              {showAnnouncement && (
                <Announcement>
                  <AnnouncementTag>Update</AnnouncementTag>
                  <Link href={announcementUrl} target={"_blank"}>
                    <AnnouncementTitle>
                      {announcementMessage}
                      <LucideArrowUpRight
                        size={14}
                        className="shrink-0 text-muted-foreground"
                      />
                    </AnnouncementTitle>
                  </Link>
                </Announcement>
              )}
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
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
