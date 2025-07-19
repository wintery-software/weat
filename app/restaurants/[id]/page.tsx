"use client";

import { type RestaurantData } from "@/app/api/restaurants/[id]/route";
import { RestaurantActions } from "@/app/restaurants/[id]/restaurant-actions";
import { RestaurantAiInsights } from "@/app/restaurants/[id]/restaurant-ai-insights";
import { RestaurantDishes } from "@/app/restaurants/[id]/restaurant-dishes";
import { RestaurantInfo } from "@/app/restaurants/[id]/restaurant-info";
import { RestaurantPhotos } from "@/app/restaurants/[id]/restaurant-photos";
import { Rating } from "@/components/rating";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const { data: restaurant } = useSuspenseQuery({
    queryKey: ["restaurant", id],
    queryFn: async () =>
      (await api.get<RestaurantData>(`/restaurants/${id}`)).data,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      {/* Background image */}
      <div
        className="h-64 w-full bg-cover bg-center md:h-80"
        style={{ backgroundImage: `url(/placeholder.svg)` }}
      />

      {/* Main content */}
      <div className="container flex flex-col gap-2 py-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <div>
              <h1>{restaurant.name_zh || restaurant.name_en}</h1>
              <p className="text-muted-foreground text-sm">
                {restaurant.name_en || restaurant.name_zh}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>
                {restaurant.summary?.average_rating?.toFixed(1) ?? "-"}
              </span>
              <Rating
                value={restaurant.summary?.average_rating ?? 0}
                size={12}
              />
              <span className="text-muted-foreground">
                ({restaurant.summary?.review_count ?? 0})
              </span>
            </div>
          </div>

          <RestaurantActions restaurant={restaurant} />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">简介</TabsTrigger>
            <TabsTrigger value="photos">照片</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-2 lg:grid-cols-5 xl:grid-cols-6">
              <div className="flex flex-col gap-2 lg:col-span-3 xl:col-span-4">
                <RestaurantAiInsights restaurant={restaurant} />
                <RestaurantDishes dishes={restaurant.dishes} />
              </div>

              <div className="lg:col-span-2 xl:col-span-2">
                <RestaurantInfo restaurant={restaurant} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <RestaurantPhotos restaurant={restaurant} />
          </TabsContent>
        </Tabs>

        <div className="text-muted-foreground self-end text-xs">
          <span>最近更新于:&nbsp;</span>
          <Popover>
            <PopoverTrigger>
              <span className="flex cursor-pointer items-center gap-1 underline decoration-dotted underline-offset-2">
                {new Date(restaurant.updated_at).toLocaleString()}
                <CircleQuestionMarkIcon className="size-3" />
              </span>
            </PopoverTrigger>
            <PopoverContent className="mr-2 p-2 text-xs" side={"top"}>
              Weat 会周期性地更新餐厅信息，以确保信息的准确性和时效性。
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default Page;
