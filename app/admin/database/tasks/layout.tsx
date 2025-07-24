import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { type PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => (
  <SuspenseWrapper>{children}</SuspenseWrapper>
);

export default Layout;
