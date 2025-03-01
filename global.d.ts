export {};

declare global {
  interface Place {
    id: string;
    name: string;
    name_translation?: string;
    address: string;
    google_maps_url: string;
    latitude: number;
    longitude: number;
  }

  interface Restaurant extends Place {
    cuisine: string;
  }
}
