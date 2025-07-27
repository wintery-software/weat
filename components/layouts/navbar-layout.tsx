import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { StoreIcon } from "lucide-react";
import { type ReactNode } from "react";

const groups = [
  {
    label: "导航",
    routes: [
      {
        href: "/restaurants",
        label: "餐厅",
        icon: <StoreIcon />,
      },
    ],
  },
];

interface NavbarLayoutProps {
  children: ReactNode;
}

export const NavbarLayout = ({ children }: NavbarLayoutProps) => (
  <div className="flex min-h-dvh flex-col">
    <Navbar groups={groups} />
    <main className="flex flex-1 flex-col">{children}</main>
    <Footer />
  </div>
);
