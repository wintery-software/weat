import CenterContentBottomLogoLayout from "@/components/layouts/center-content-bottom-logo-layout";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";
import { signIn } from "@/lib/next-auth";
import { getCurrentUrl } from "@/lib/utils-server";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthenticatedProps {
  children: ReactNode;
  autoAuthenticate?: boolean;
}

const Authenticated = async ({ children, autoAuthenticate }: AuthenticatedProps) => {
  const currentUrl = await getCurrentUrl();

  if (!(await isAuthenticated())) {
    if (!autoAuthenticate) {
      return (
        <CenterContentBottomLogoLayout>
          <p className="font-medium">User is not authenticated.</p>
          <Button size={"sm"} asChild>
            <Link href={`/login?redirect_to=${currentUrl.toString()}`}>Sign in</Link>
          </Button>
        </CenterContentBottomLogoLayout>
      );
    }

    await signIn();
  }

  return <>{children}</>;
};

export default Authenticated;
