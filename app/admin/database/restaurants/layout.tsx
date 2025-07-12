import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";

const Layout = ({ children }: PropsWithChildren) => (
  <SuspenseWrapper>{children}</SuspenseWrapper>
);

export default Layout;
