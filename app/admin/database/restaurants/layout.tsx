import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { type PropsWithChildren } from "react";

export const dynamic = "force-dynamic";

const Layout = ({ children }: PropsWithChildren) => (
  <SuspenseWrapper>{children}</SuspenseWrapper>
);

export default Layout;
