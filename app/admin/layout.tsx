import { AdminLayout } from "@/app/admin/admin-layout";
import { generateTitle } from "@/lib/utils";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: generateTitle("Admin Dashboard"),
};

const Layout = ({ children }: PropsWithChildren) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default Layout;
