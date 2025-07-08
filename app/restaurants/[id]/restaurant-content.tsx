import { RestaurantActions } from "@/app/restaurants/[id]/restaurant-actions";
import { RestaurantContact } from "@/app/restaurants/[id]/restaurant-contact";
import { RestaurantDishes } from "@/app/restaurants/[id]/restaurant-dishes";
import { RestaurantTags } from "@/app/restaurants/[id]/restaurant-tags";
import { Rating } from "@/components/rating";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchRestaurant } from "@/lib/api/restaurant";
import { AI_NAME } from "@/lib/constants";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const RestaurantContent = async ({ id }: { id: string }) => {
  const restaurant = await fetchRestaurant(id);

  return (
    <>
      <div
        className="h-64 w-full bg-cover bg-center md:h-80"
        style={{ backgroundImage: `url(/placeholder.svg)` }}
      />

      <div className="container flex flex-col gap-2 py-4 md:py-8">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <div id="name">
              <h1 className="text-2xl font-bold md:text-3xl">
                {restaurant.name_zh || restaurant.name_en}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {restaurant.name_en || restaurant.name_zh}
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div id="rating" className="flex items-center gap-2">
                <span className="font-medium">
                  {restaurant.summary?.average_rating?.toFixed(1) ?? "-"}
                </span>
                <Rating
                  value={restaurant.summary?.average_rating ?? 0}
                  size={16}
                />
              </div>
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
            <div className="grid gap-4 lg:grid-cols-5 xl:grid-cols-6">
              <div className="flex flex-col gap-4 lg:col-span-3 xl:col-span-4">
                <Card
                  id="ai-insights"
                  className="bg-gradient-to-br from-rose-50 via-white via-25% to-violet-50"
                >
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-5 text-violet-600" />
                      <h3 className="bg-gradient-to-r from-violet-500 to-rose-400 bg-clip-text text-lg font-semibold text-transparent">
                        {AI_NAME}
                      </h3>
                    </div>

                    <h3 className="text-lg font-semibold">评测</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {restaurant.summary?.summary || "暂无分析内容"}
                      </ReactMarkdown>
                    </div>

                    <RestaurantTags tags={restaurant.tags ?? []} />
                  </CardContent>
                </Card>

                <Card id="popular-dishes">
                  <CardContent className="flex flex-col gap-4">
                    <RestaurantDishes dishes={restaurant.dishes ?? []} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 xl:col-span-2">
                <RestaurantContact restaurant={restaurant} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <Card id="photos">
              <CardContent>
                {/* Carousel for mobile */}
                <div className="md:hidden">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {Array.from({ length: 8 }).map((_, index) => (
                        <CarouselItem key={index}>
                          <div className="group relative aspect-square overflow-hidden rounded-lg">
                            <Image
                              src="/placeholder.svg"
                              alt={`${restaurant.name_zh || restaurant.name_en || "-"} photo ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>

                {/* Grid for larger screens */}
                <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-lg"
                    >
                      <Image
                        src="/placeholder.svg"
                        alt={`${restaurant.name_zh || restaurant.name_en || "-"} photo ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
