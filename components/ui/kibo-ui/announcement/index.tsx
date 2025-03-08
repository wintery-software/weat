import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type AnnouncementProps = BadgeProps & {
  themed?: boolean;
};

export const Announcement = ({ variant = "outline", themed = false, className, ...props }: AnnouncementProps) => (
  <Badge
    variant={variant}
    className={cn(
      "group max-w-full gap-2 rounded-full bg-background px-3 py-0.5 font-medium shadow-sm transition-all",
      "hover:shadow-md",
      themed && "announcement-themed border-foreground/5",
      className,
    )}
    {...props}
  />
);

export type AnnouncementTagProps = HTMLAttributes<HTMLDivElement>;

export const AnnouncementTag = ({ className, ...props }: AnnouncementTagProps) => (
  <div
    className={cn(
      "-ml-2.5 shrink-0 truncate rounded-full bg-foreground/5 px-2.5 py-1 text-xs dark:bg-foreground/15",
      "group-[.announcement-themed]:bg-background/60",
      className,
    )}
    {...props}
  />
);

export type AnnouncementTitleProps = HTMLAttributes<HTMLDivElement>;

export const AnnouncementTitle = ({ className, ...props }: AnnouncementTitleProps) => (
  <div className={cn("flex items-center gap-1 truncate py-1", className)} {...props} />
);
