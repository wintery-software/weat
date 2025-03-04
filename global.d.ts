import { LucideProps } from "lucide-react";
import { dynamicIconImports } from "lucide-react/dynamic";

export {};

declare module "lucide-react" {
  export * from "lucide-react/dist/lucide-react.prefixed";
}

declare global {
  interface Data {
    id: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Place extends Data {
    name: string;
    name_translation?: string;
    address: string;
    google_maps_url: string;
    position: google.maps.LatLngLiteral;
    category: PlaceCategory;
  }

  export type PlaceCategory =
    | "restaurant"
    | "drink"
    | "park"
    | "dogPark"
    | "entertainment";

  interface RestaurantPlace extends Place {
    cuisine: string;
  }

  interface DrinkPlace extends Place {}

  interface ParkPlace extends Place {
    admissionFee?: string;
    dogPolicy?: string;
    dogPolicyUrl?: string;
  }

  interface DogParkPlace extends Place {}

  interface EntertainmentPlace extends Place {}

  interface LucideIconProps extends LucideProps {
    name: keyof typeof dynamicIconImports;
  }

  interface WeatNotification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    url?: string;
    createdAt: string;
  }

  export type NotificationType = "info" | "success" | "warning" | "error";
}
