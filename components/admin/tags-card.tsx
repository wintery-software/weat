"use client";

import type { TagsCountGetResponse } from "@/app/api/admin/tags/count/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { APIError } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { TagsIcon } from "lucide-react";
import Link from "next/link";

export const TagsCard = () => {
  const { data: count } = useQuery<
    AxiosResponse<TagsCountGetResponse>,
    APIError,
    number
  >({
    queryKey: ["admin", "tags", "count"],
    queryFn: () => api.get("/admin/tags/count"),
    select: (res) => res.data.count,
    refetchOnWindowFocus: true,
  });

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>
          <Link
            href="/admin/database/tags"
            className="flex items-center gap-2 font-medium underline-offset-2 hover:underline"
          >
            <TagsIcon className="size-4" />
            Total Tags
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">
          {count ? count.toLocaleString() : <Skeleton className="h-8 w-16" />}
        </div>
      </CardContent>
    </Card>
  );
};
