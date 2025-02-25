import { ReactNode } from "react";

const DevelopmentOnly = ({ children }: { children?: ReactNode }) => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return children;
};

export default DevelopmentOnly;
