"use client";

import { cn } from "@/lib/utils";
import { LucideLoader2 } from "lucide-react";
import type { ReactNode } from "react";

interface FullscreenLoaderProps {
  label?: string;
  children?: ReactNode;
  className?: string;
}

export const FullscreenLoader = ({ label = "Loading...", children, className }: FullscreenLoaderProps) => {
  return (
    <div className={cn("fixed inset-0 z-50 bg-background/80", className)}>
      <div className="flex h-full flex-col items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <LucideLoader2 className="size-3.5 animate-spin" />
          <span>{label}</span>
        </div>
        {children}
      </div>
    </div>
  );
};
