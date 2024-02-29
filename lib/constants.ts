export interface SortOrdersType {
  asc: string;
  desc: string;
}

export interface RestaurantSortFieldsType {
  rating: string;
  price: string;
  distance?: string;
}

export const meterToMile = (meters: number) => meters / 1609.34;
