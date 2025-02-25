export declare global {
  interface Restaurant {
    id: string;
    name: string;
    name_translation?: string;
    address: string;
    google_maps_url: string;
    cuisine?: string;
    latitude: number;
    longitude: number;
  }
}
