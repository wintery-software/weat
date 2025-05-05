import { cn } from "@/lib/utils";
import { LucideGalleryVerticalEnd } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

interface BottomLogoLayoutProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
}

const BottomLogoLayout = ({ className, children }: BottomLogoLayoutProps) => (
  <div className={cn("flex h-full w-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10", className)}>
    <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-6">
      <div className="flex items-center justify-center text-sm">{children}</div>
    </div>
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-center gap-2 self-center font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <LucideGalleryVerticalEnd className="size-4" />
        </div>
        <span>Wintery Software</span>
      </div>
    </div>
  </div>
);

export default BottomLogoLayout;
