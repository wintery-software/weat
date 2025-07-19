import { AdminLayout } from "@/components/layouts/admin-layout";
import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { generateTitle } from "@/lib/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: generateTitle("Admin Dashboard"),
};

const Layout = async ({ children }: PropsWithChildren) => {
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default Layout;
