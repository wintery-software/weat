"use client";
import { AxiosResponse } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { APIError } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { UtensilsIcon } from "lucide-react";
import Link from "next/link";
import { RestaurantsCountGetResponse } from "../api/admin/restaurants/count/route";

export const RestaurantsCard = () => {
  const { data: allCount } = useQuery<
    AxiosResponse<RestaurantsCountGetResponse>,
    APIError,
    number
  >({
    queryKey: ["admin", "restaurants", "count", "all"],
    queryFn: () => api.get("/admin/restaurants/count"),
    select: (res) => res.data.count,
    refetchOnWindowFocus: true,
  });

  const { data: summarizedCount } = useQuery<
    AxiosResponse<RestaurantsCountGetResponse>,
    APIError,
    number
  >({
    queryKey: ["admin", "restaurants", "count", "summarized"],
    queryFn: () => api.get("/admin/restaurants/count?type=summarized"),
    select: (res) => res.data.count,
    refetchOnWindowFocus: true,
  });

  const { data: taggedCount } = useQuery<
    AxiosResponse<RestaurantsCountGetResponse>,
    APIError,
    number
  >({
    queryKey: ["admin", "restaurants", "count", "tagged"],
    queryFn: () => api.get("/admin/restaurants/count?type=tagged"),
    select: (res) => res.data.count,
    refetchOnWindowFocus: true,
  });

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>
          <Link
            href="/admin/database/restaurants"
            className="flex items-center gap-2 font-medium underline-offset-2 hover:underline"
          >
            <UtensilsIcon className="size-4" />
            Total Restaurants
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-semibold">
            {allCount ? (
              allCount.toLocaleString()
            ) : (
              <Skeleton className="h-8 w-16" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex text-sm">
              <span className="font-semibold">
                {summarizedCount ? (
                  summarizedCount.toLocaleString()
                ) : (
                  <Skeleton className="h-5 w-10" />
                )}
              </span>
              <span className="text-muted-foreground">
                &nbsp;summarized&nbsp;(
              </span>
              <span className="font-semibold">
                {allCount && summarizedCount ? (
                  (allCount - summarizedCount).toLocaleString()
                ) : (
                  <Skeleton className="h-5 w-10" />
                )}
              </span>
              <span className="text-muted-foreground">&nbsp;left)</span>
            </div>
            <div className="flex text-sm">
              <span className="font-semibold">
                {taggedCount ? (
                  taggedCount.toLocaleString()
                ) : (
                  <Skeleton className="h-5 w-10" />
                )}
              </span>
              <span className="text-muted-foreground">&nbsp;tagged&nbsp;(</span>
              <span className="font-semibold">
                {allCount && taggedCount ? (
                  (allCount - taggedCount).toLocaleString()
                ) : (
                  <Skeleton className="h-5 w-10" />
                )}
              </span>
              <span className="text-muted-foreground">&nbsp;left)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
