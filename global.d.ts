import { google } from "@googlemaps/places/build/protos/protos";
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
      names: google.type.ILocalizedText[];
      types: PlaceType[];
      address: string;
      googleMapsUrl: string;
      position: google.maps.LatLngLiteral;
      phoneNumber: string | null;
      websiteUrl: string | null;
    }

    enum PlaceType {
      RESTAURANT = "restaurant",
      DRINK = "drink",
      PARK = "park",
      DOG_PARK = "dogPark",
      ENTERTAINMENT = "entertainment",
      OTHER = "other",
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

    namespace Dynamo {
      interface Data {
        Id: string;
        CreatedAt: string;
        UpdatedAt: string;
      }

      interface Place extends Data {
        PlaceId: string;
        Names: {
          Text: string;
          LanguageCode: LanguageCode;
        }[];
        Types: Set<PlaceType>;
        Address: string;
        GoogleMapsUrl: string;
        Position: {
          Lat: number;
          Lng: number;
        };
        PhoneNumber: string | null;
        WebsiteUrl: string | null;
      }
    }
  }
}
