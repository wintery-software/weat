"use client";

import type { Restaurant } from "@/types/restaurant";
import { RestaurantCardGrid } from "./restaurant-card-grid";
import { RestaurantCardList } from "./restaurant-card-list";

interface RestaurantCardProps {
  restaurant: Restaurant;
  view: "grid" | "list";
}

export const RestaurantCard = ({ restaurant, view }: RestaurantCardProps) => {
  return view === "grid" ? (
    <RestaurantCardGrid restaurant={restaurant} />
  ) : (
    <RestaurantCardList restaurant={restaurant} />
  );
};
