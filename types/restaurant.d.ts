import type { Paginated } from "./types";

export interface Location {
  lat: number;
  lng: number;
}

export interface Address {
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zipcode: string;
}

export interface RestaurantSummary {
  headline: string;
  sentimentScore: number;
  aspects: {
    taste: string[];
    service: string[];
    environment: string[];
  };
  keywords: string[];
}

export interface ExternalLinks {
  website?: string;
  googleMaps?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: Address;
  location: Location;
  tags: string[];
  summary: RestaurantSummary;
  externalLinks: ExternalLinks;
}

export type RestaurantsResponse = Paginated<Restaurant[]>;

export type RestaurantResponse = Paginated<Restaurant>;
