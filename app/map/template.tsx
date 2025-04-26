"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { type ReactNode } from "react";

const Template = ({ children }: { children: ReactNode }) => (
  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["core", "marker"]}>
    {children}
  </APIProvider>
);

export default Template;
