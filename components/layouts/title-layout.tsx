import type { ReactNode } from "react";

interface H1LayoutProps {
  title: string;
  children: ReactNode;
}

const TitleLayout = ({ title, children }: H1LayoutProps) => {
  return (
    <>
      <h1>{title}</h1>
      <div className="mt-8">{children}</div>
    </>
  );
};

export default TitleLayout;
