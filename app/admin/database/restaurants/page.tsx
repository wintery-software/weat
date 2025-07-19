"use client";

import { api } from "@/lib/api";
import { type Paginated, type Restaurant } from "@/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";

const Page = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["admin", "restaurants"],
    queryFn: () => api.get<Paginated<Restaurant>>("/admin/restaurants"),
  });

  return (
    <pre className="text-xs whitespace-pre-wrap">
      {JSON.stringify(data.data, null, 2)}
    </pre>
  );
};

export default Page;
