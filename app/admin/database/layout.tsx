import SuspenseLayout from "@/components/layouts/suspense-wrapper";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => (
  <SuspenseLayout>{children}</SuspenseLayout>
);

export default Layout;
