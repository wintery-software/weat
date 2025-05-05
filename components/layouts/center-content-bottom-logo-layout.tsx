import BottomLogoLayout from "@/components/layouts/bottom-logo-layout";
import type { ComponentPropsWithoutRef } from "react";

interface FullscreenBottomLogoLayoutProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
}

const CenterContentBottomLogoLayout = ({ className, children }: FullscreenBottomLogoLayoutProps) => (
  <BottomLogoLayout className={className}>
    <div className="flex flex-col items-center gap-1">{children}</div>
  </BottomLogoLayout>
);

export default CenterContentBottomLogoLayout;
