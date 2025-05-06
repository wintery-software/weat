"use client";

import { Banner, BannerAction, BannerClose, BannerIcon, BannerTitle } from "@/components/ui/kibo-ui/banner";
import type { AlertType, BannerMessage } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { LucideCircleAlert, LucideCircleCheck, LucideCircleChevronRight, LucideCircleX } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

const BANNER_STYLES: Record<
  AlertType,
  {
    color: {
      primary: string;
      primaryForeground: string;
    };
    icon: LucideIcon;
  }
> = {
  info: {
    color: {
      primary: "#0a0a0a",
      primaryForeground: "#fafafa",
    },
    icon: LucideCircleChevronRight,
  },
  success: {
    color: {
      primary: "#15803d",
      primaryForeground: "#fafafa",
    },
    icon: LucideCircleCheck,
  },
  warning: {
    color: {
      primary: "#f59e0b",
      primaryForeground: "#fafafa",
    },
    icon: LucideCircleAlert,
  },
  error: {
    color: {
      primary: "#b91c1c",
      primaryForeground: "#fafafa",
    },
    icon: LucideCircleX,
  },
};

export const DynamicBanner = () => {
  const messageQuery = useQuery<BannerMessage>({
    queryKey: ["dynamicBanner"],
    queryFn: async () => {
      const response = await fetch("/api/banner");

      if (!response.ok) {
        throw new Error("Failed to fetch banner message");
      }

      return response.json();
    },
  });

  const data = messageQuery.data;
  const message = data?.message;

  if (!message) {
    return null;
  }

  const url = data?.url;

  const type = data?.type || "info";
  const style = BANNER_STYLES[type];

  console.log(data, style);

  return (
    <div
      className="z-50 w-full"
      style={
        {
          "--primary": style.color.primary,
          "--primary-foreground": style.color.primaryForeground,
        } as CSSProperties
      }
    >
      <Banner>
        <BannerIcon icon={style.icon} />
        <BannerTitle>{message}</BannerTitle>
        {url && (
          <BannerAction asChild>
            <Link href={url} target="_blank">
              Learn more
            </Link>
          </BannerAction>
        )}
        <BannerClose />
      </Banner>
    </div>
  );
};
