import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { MapIcon, StoreIcon } from "lucide-react";
import { type PropsWithChildren } from "react";

interface NavbarLayoutProps extends PropsWithChildren {
  fullscreen?: boolean;
  searchBar?: boolean;
  footer?: boolean;
}

const NAVIGATION_GROUPS = [
  {
    label: "导航",
    routes: [
      {
        href: "/discover",
        label: "发现",
        icon: <StoreIcon />,
      },
      {
        href: "/nearby",
        label: "附近",
        icon: <MapIcon />,
      },
    ],
  },
];

export const NavbarLayout = ({
  children,
  fullscreen = false,
  searchBar = true,
  footer = true,
}: NavbarLayoutProps) => (
  <div className={cn("flex flex-col", fullscreen ? "h-screen" : "min-h-dvh")}>
    <Navbar searchBar={searchBar} groups={NAVIGATION_GROUPS} />
    <main className="flex-1">{children}</main>
    {footer && <Footer />}
  </div>
);
