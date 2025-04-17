export namespace API {
  interface Base {
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

  interface Place extends Base {
    name: string;
    name_zh: string | null;
    type: PlaceType;
    address: string;
    latitude: number;
    longitude: number;
    google_maps_url: string;
    google_maps_place_id: string;
    phone_number: string | null;
    website_url: string | null;
    opening_hours: never[] | null;
    properties: Record<string, unknown> | null;
    tags: string[];
  }

  type PlaceType = "food";
}
