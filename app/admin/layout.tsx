import Authenticated from "@/components/auth/authenticated-server";
import Authorized from "@/components/auth/authorized-server";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { getCurrentUrl } from "@/lib/utils-server";
import { LucideDatabase, LucideHelpCircle, LucideLayoutDashboard, LucideSettings } from "lucide-react";
import type { ReactNode } from "react";

const content = [
  {
    items: [
      {
        title: "Dashboard",
        icon: LucideLayoutDashboard,
        url: "/admin",
      },
    ],
  },
  {
    title: "Data",
    items: [
      {
        title: "Database",
        icon: LucideDatabase,
        url: "/admin/database",
      },
    ],
  },
];

const footer = [
  {
    items: [
      {
        title: "Settings",
        icon: LucideSettings,
        url: "/admin/settings",
      },
      {
        title: "Help",
        icon: LucideHelpCircle,
        url: "/admin/help",
      },
    ],
  },
];

const breadcrumbs = [
  {
    title: "Admin",
    url: "/admin",
  },
];

const Layout = async ({ children }: { children: ReactNode }) => {
  const { pathname } = await getCurrentUrl();

  const contentWithActive = content.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: item.url === pathname,
    })),
  }));

  const footerWithActive = footer.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: item.url === pathname,
    })),
  }));

  return (
    <Authenticated>
      <Authorized groups={["admin"]}>
        <SidebarLayout content={contentWithActive} footer={footerWithActive} breadcrumbs={breadcrumbs}>
          <main className="p-4">{children}</main>
        </SidebarLayout>
      </Authorized>
    </Authenticated>
  );
};

export default Layout;
