import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HelpCircleIcon, ShieldIcon, StoreIcon } from "lucide-react";
import { ReactNode } from "react";

interface NavbarLayoutProps {
  children: ReactNode;
}

export const NavbarLayout = ({ children }: NavbarLayoutProps) => {
  // TODO: use supabase auth
  const isAdmin = process.env.NODE_ENV === "development";

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
    {
      label: "其他",
      routes: [
        {
          href: "/help",
          label: "帮助",
          icon: <HelpCircleIcon />,
        },
      ],
    },
  ];

  if (isAdmin) {
    groups.push({
      label: "Admin",
      routes: [
        {
          href: "/admin",
          label: "Dashboard",
          icon: <ShieldIcon className="text-error" />,
        },
      ],
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar groups={groups} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
