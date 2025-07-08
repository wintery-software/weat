"use client";

import { useSuspenseRestaurants } from "@/hooks/db/use-restaurants";

const Page = () => {
  const { data } = useSuspenseRestaurants();

  return (
    <pre className="text-xs whitespace-pre-wrap">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default Page;
