"use client";

import { AppSidebar, AppSidebarGroup } from "@/components/app-sidebar";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SearchIcon, TagIcon, UsersIcon, UtensilsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { PropsWithChildren, Suspense, useMemo } from "react";

const groups: AppSidebarGroup[] = [
  {
    items: [
      {
        label: "Search",
        icon: <SearchIcon />,
        href: "/admin",
      },
    ],
  },
  {
    label: "Database",
    items: [
      {
        label: "Restaurants",
        icon: <UtensilsIcon />,
        href: "/admin/database/restaurants",
      },
      {
        label: "Tags",
        icon: <TagIcon />,
        href: "/admin/database/tags",
      },
      {
        label: "Users",
        icon: <UsersIcon />,
        href: "/admin/database/users",
      },
    ],
  },
];

const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  const { groupsWithActive, activeTitle } = useMemo(() => {
    let activeTitle = "Admin Dashboard";

    const groupsWithActive = groups.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        const isActive = item.href === pathname;

        if (isActive) {
          activeTitle = item.label;
        }

        return {
          ...item,
          active: isActive,
        };
      }),
    }));

    return { groupsWithActive, activeTitle };
  }, [pathname]);

  return (
    <SidebarProvider>
      <AppSidebar homePage="/admin" groups={groupsWithActive} />
      <SidebarInset className="md:peer-data-[variant=inset]:border-1 md:peer-data-[variant=inset]:shadow-none">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1>{activeTitle}</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </ErrorBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
