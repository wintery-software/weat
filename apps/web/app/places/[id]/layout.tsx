import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import NotFound from "@/components/not-found";
import { fetchPlace } from "@/hooks/map/use-places";
import type { ReactNode } from "react";

interface LayoutProps {
  params: Promise<{ id: string }>;
  children: ReactNode;
}

const Layout = async ({ params, children }: LayoutProps) => {
  const { id } = await params;

  let place;

  try {
    place = await fetchPlace(id);
  } catch {
    return <NotFound />;
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
