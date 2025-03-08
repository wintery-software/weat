import { LucideProps } from "lucide-react";
import { dynamicIconImports } from "lucide-react/dynamic";

export {};

declare module "lucide-react" {
  export * from "lucide-react/dist/lucide-react.prefixed";
}

declare global {
  interface LucideIconProps extends LucideProps {
    name: keyof typeof dynamicIconImports;
  }

  type AlertType = "info" | "success" | "warning" | "error";
  type LanguageCode = "en" | "en-US" | "zh-CN" | "zh-TW";

  namespace Weat {
    interface Data {
      id: string;
      createdAt: string;
      updatedAt: string;
    }

    interface Place extends Data {
      placeId: string;
      name: {
        languageCode: LanguageCode;
        text: string;
      };
      types: PlaceType[];
      address: string;
      googleMapsUrl: string;
      location: google.maps.LatLngLiteral;
      phoneNumber: string;
      websiteUrl: string;
    }

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

    interface Notification {
      id: string;
      type: AlertType;
      title: string;
      description: string;
      url?: string;
      createdAt: string;
    }

    type PlaceType = "restaurant" | "drink" | "park" | "dogPark" | "entertainment" | "other";

    namespace Dynamo {
      interface Data {
        Id: string;
        CreatedAt: string;
        UpdatedAt: string;
      }

      interface Place extends Data {
        PlaceId: string;
        Name: {
          Text: string;
          LanguageCode: string;
        };
        Types: Set<PlaceType>;
        Address: string;
        GoogleMapsUrl: string;
        Location: {
          Lat: number;
          Lng: number;
        };
        PhoneNumber: string | null;
        WebsiteUrl: string | null;
      }
    }
  }
}
