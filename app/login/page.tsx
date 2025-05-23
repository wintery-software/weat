"use client";

import BottomLogoLayout from "@/components/layouts/bottom-logo-layout";
import { LucideLoader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { use, useEffect } from "react";

interface PageProps {
  searchParams: Promise<{ redirect_to: string }>;
}

const Page = ({ searchParams }: PageProps) => {
  const { redirect_to } = use(searchParams);

  useEffect(() => {
    const previousPage = document.referrer;
    const redirectTo = redirect_to ?? previousPage ?? "/";

    // noinspection JSIgnoredPromiseFromCall
    signIn("cognito", { redirectTo });
  }, [redirect_to]);

  return (
    <BottomLogoLayout>
      <div className="flex items-center gap-1 self-center text-sm">
        <LucideLoader2 className="size-4 animate-spin" />
        Signing in...
      </div>
    </BottomLogoLayout>
  );
};

export default Page;
