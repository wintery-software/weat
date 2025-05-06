import CenterContentBottomLogoLayout from "@/components/layouts/center-content-bottom-logo-layout";
import { headers } from "next/headers";
import Link from "next/link";

const NotFound = async () => {
  const referer = (await headers()).get("referer") || "/";

  return (
    <CenterContentBottomLogoLayout>
      <p className="font-medium">Page not found.</p>
      <Link href={referer} className="text-sm text-muted-foreground underline">
        Go back
      </Link>
    </CenterContentBottomLogoLayout>
  );
};

export default NotFound;
