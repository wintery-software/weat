"use client";

import { api } from "@/lib/api";
import { Restaurant } from "@/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";

const Page = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["admin", "restaurants"],
    queryFn: () => api.get<Restaurant[]>("/restaurants"),
  });

  return (
    <pre className="text-xs whitespace-pre-wrap">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default Page;
