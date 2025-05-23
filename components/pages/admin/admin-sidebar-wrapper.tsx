"use client";

import type { BreadcrumbItemProps, SidebarGroupProps } from "@/components/layouts/sidebar-layout";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export const AdminLayoutWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const content: SidebarGroupProps[] = [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          isActive: pathname === "/admin",
        },
      ],
    },
    {
      title: "Data",
      items: [
        {
          title: "Places",
          url: "/admin/data/places",
          isActive: pathname === "/admin/data/places",
        },
      ],
    },
  ];

  const breadcrumbs: BreadcrumbItemProps[] = [
    { title: "Admin", url: "/admin" },
    { title: "Dashboard", url: "#" },
  ];

  return (
    <SidebarLayout content={content} breadcrumbs={breadcrumbs}>
      {children}
    </SidebarLayout>
  );
};
