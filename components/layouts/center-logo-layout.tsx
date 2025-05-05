import { LucideGalleryVerticalEnd } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

const CenterLogoLayout = ({ children }: ComponentPropsWithoutRef<"div">) => (
  <div className="flex flex-grow flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-center gap-2 self-center font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <LucideGalleryVerticalEnd className="size-4" />
        </div>
        <span>Wintery Software</span>
      </div>
      <div className="flex items-center justify-center">{children}</div>
    </div>
  </div>
);

export default CenterLogoLayout;
