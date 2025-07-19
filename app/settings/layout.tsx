import { NavbarLayout } from "@/components/layouts/navbar-layout";
import { createSSRClient } from "@/lib/supabase/clients/ssr";
import { generateTitle } from "@/lib/utils";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: generateTitle("个人设置"),
};

const Layout = async ({ children }: { children: ReactNode }) => {
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <NavbarLayout>{children}</NavbarLayout>;
};

export default Layout;
