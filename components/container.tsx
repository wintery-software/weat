import { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto">
      <div className="mt-8">{children}</div>
    </div>
  );
};

export default Container;
