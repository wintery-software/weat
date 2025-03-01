import type { ReactNode } from "react";

export const Navigation = ({ children }: { children: ReactNode }) => {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="flex h-12 items-center">{children}</div>
    </header>
  );
};
