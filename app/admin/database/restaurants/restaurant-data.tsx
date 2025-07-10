import { RestaurantsGETResponse } from "@/app/api/restaurants/route";
import { use } from "react";

interface RestaurantDataProps {
  data: Promise<RestaurantsGETResponse>;
}

export const RestaurantData = ({ data }: RestaurantDataProps) => {
  const restaurants = use(data);

  return (
    <pre className="text-xs whitespace-pre-wrap">
      {JSON.stringify(restaurants, null, 2)}
    </pre>
  );
};
