import type { ReactNode } from "react";

interface DevelopmentViewProps {
  style?: boolean;
  children: ReactNode;
}

const DevelopmentView = ({ style, children }: DevelopmentViewProps) => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!style) {
    return children;
  }

  return <div className="border border-dashed border-black bg-muted-foreground/25 font-mono">{children}</div>;
};

export default DevelopmentView;
