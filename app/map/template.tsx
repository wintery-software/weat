"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ReactNode } from "react";

const Template = ({ children }: { children: ReactNode }) => (
  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["core", "marker"]}>
    <SidebarProvider>{children}</SidebarProvider>
  </APIProvider>
);

export default Template;
