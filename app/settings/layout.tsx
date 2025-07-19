import { NavbarLayout } from "@/components/layouts/navbar-layout";
import { type ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <NavbarLayout>{children}</NavbarLayout>;
};

export default Layout;
