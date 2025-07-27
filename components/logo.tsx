import { cn } from "@/lib/utils";
import { type ComponentProps } from "react";

export const WeatLogo = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "inline-block bg-[url('/weat-64x64.png')] bg-cover bg-center bg-no-repeat",
      className,
    )}
    aria-label="Weat Logo"
    role="img"
    {...props}
  />
);
