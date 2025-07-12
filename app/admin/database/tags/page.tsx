"use client";

import { api } from "@/lib/api";
import { Tag } from "@/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";

const Page = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["admin", "tags"],
    queryFn: () => api.get<Tag[]>("/admin/tags"),
  });

  return (
    <pre className="text-xs whitespace-pre-wrap">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default Page;
