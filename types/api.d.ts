import type { PlaceTypes } from "@/lib/constants";

export namespace API {
  export interface Base {
    id: string;
    created_at: string;
    updated_at: string;
  }

  interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    page_size: number;
  }

  interface BasePlace extends Base {
    name: string;
    name_zh: string | null;
    type: PlaceType;
    location: {
      latitude: number;
      longitude: number;
    };
  }

  interface Place extends BasePlace {
    address: string;
    google_maps_url: string;
    google_maps_place_id: string;
    phone_number: string | null;
    website_url: string | null;
    opening_hours: OpeningHours[];
    properties: Record<string, unknown>;
    tags: Tag[];
  }

  interface Tag {
    id: string;
    name: string;
    tag_type_id: string;
    tag_type_name: string;
  }

  interface OpeningHours {
    day: number;
    periods: [
      {
        open: string;
        close: string;
      },
    ];
  }

  type CreatePlace = Omit<Place, "id" | "created_at" | "updated_at">;
  type UpdatePlace = CreatePlace;

  type PlaceType = PlaceTypes;
}
