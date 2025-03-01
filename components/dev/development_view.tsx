import type { ReactNode } from "react";

const DevelopmentView = ({ children }: { children?: ReactNode }) => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return children;
};

export default DevelopmentView;
