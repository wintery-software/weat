import { NavbarLayout } from "@/components/layouts/navbar-layout";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => (
  <NavbarLayout>{children}</NavbarLayout>
);

export default Layout;
