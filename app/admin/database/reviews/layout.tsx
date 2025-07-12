import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => (
  <SuspenseWrapper>{children}</SuspenseWrapper>
);

export default Layout;
