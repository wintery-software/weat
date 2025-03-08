import { ReactNode } from "react";

interface H1LayoutProps {
  title: string;
  children: ReactNode;
}

const H1Layout = ({ title, children }: H1LayoutProps) => {
  return (
    <>
      <h1>{title}</h1>
      <div className="mt-8">{children}</div>
    </>
  );
};

export default H1Layout;
