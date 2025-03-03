import { LucideProps } from "lucide-react";
import { dynamicIconImports } from "lucide-react/dynamic";

export {};

declare module "lucide-react" {
  export * from "lucide-react/dist/lucide-react.prefixed";
}

declare global {
  interface Data {
    id: string;
    createdAt: number;
    updatedAt: number;
  }

  interface Place extends Data {
    name: string;
    name_translation?: string;
    address: string;
    google_maps_url: string;
    latitude: number;
    longitude: number;
    category: PlaceCategory;
  }

  export type PlaceCategory =
    | "restaurant"
    | "drink"
    | "snack"
    | "trail"
    | "entertainment";

  interface Restaurant extends Place {
    cuisine: string;
  }

  interface LucideIconProps extends LucideProps {
    name: keyof typeof dynamicIconImports;
  }
}
