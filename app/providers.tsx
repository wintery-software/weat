"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      onLoad={() => console.log("Google Maps API has loaded.")}
      libraries={["core", "marker"]}
    >
      {children}
    </APIProvider>
  );
}
