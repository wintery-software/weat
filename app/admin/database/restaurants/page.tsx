"use client";

import { useSuspenseRestaurants } from "@/hooks/db/restaurants";

// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

const Page = () => {
  const { data: restaurants = [] } = useSuspenseRestaurants();

  return (
    <pre className="text-xs whitespace-pre-wrap">
      {JSON.stringify(restaurants, null, 2)}
    </pre>
  );
};

export default Page;
