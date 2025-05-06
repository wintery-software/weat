import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { getPlace } from "@/lib/api/places";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface LayoutProps {
  params: Promise<{ id: string }>;
  children: ReactNode;
}

const Layout = async ({ params, children }: LayoutProps) => {
  const { id } = await params;

  let place;

  try {
    place = await getPlace(id);
  } catch {
    redirect("/not-found");
  }

  return (
    <SidebarLayout
      content={[
        {
          title: "Menu",
          items: [
            { title: "Place 1", url: "/places/1" },
            { title: "Place 2", url: "/places/2" },
            { title: "Place 3", url: "/places/3" },
          ],
        },
      ]}
      breadcrumbs={[
        {
          title: "Places",
          url: "/places",
        },
        {
          title: place.name,
          url: `/places/${id}`,
        },
      ]}
    >
      {children}
    </SidebarLayout>
  );
};

export default Layout;
