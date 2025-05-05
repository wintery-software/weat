import CenterContentBottomLogoLayout from "@/components/layouts/center-content-bottom-logo-layout";
import { isAuthorized } from "@/lib/auth";
import type { CognitoUserGroup } from "@/types";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthorizedProps {
  children: ReactNode;
  groups: CognitoUserGroup[];
}

const Authorized = async ({ children, groups }: AuthorizedProps) => {
  if (!(await isAuthorized(groups))) {
    return (
      <CenterContentBottomLogoLayout>
        <p className="font-medium">User is not authorized to access this page.</p>
        <Link href={"/help"} className="text-sm text-muted-foreground underline">
          Need help?
        </Link>
      </CenterContentBottomLogoLayout>
    );
  }

  return <>{children}</>;
};

export default Authorized;
