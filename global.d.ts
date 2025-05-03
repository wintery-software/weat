import { type LucideProps } from "lucide-react";
import type { dynamicIconImports } from "lucide-react/dynamic";

export {};

declare module "lucide-react" {
  export * from "lucide-react/dist/lucide-react.prefixed";
}

declare global {
  interface LucideIconProps extends LucideProps {
    name: keyof typeof dynamicIconImports;
  }

  type AlertType = "info" | "success" | "warning" | "error";
}
