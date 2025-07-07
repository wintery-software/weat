import { RestaurantContactCard } from "@/app/restaurants/[id]/restaurant-contact-card";
import { Rating } from "@/components/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { MessageCircleMore, Navigation, Share, Sparkles } from "lucide-react";
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

      <div className="container py-4 md:py-6">
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

          <div className="flex gap-2">
            <Button
              size={"icon"}
              variant="secondary"
              title="导航"
              className="cursor-pointer"
              asChild
            >
              <a href="#contact">
                <Navigation />
                <span className="sr-only">导航</span>
              </a>
            </Button>
            <Button
              size={"icon"}
              variant="secondary"
              title="分享"
              className="cursor-pointer"
              asChild
            >
              <a
                href={`https://twitter.com/intent/tweet?text=在 Weat 上发现了一个餐厅：${restaurant.name_zh || restaurant.name_en || "this restaurant"}&url=${encodeURIComponent(`https://yourdomain.com/restaurants/${id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Share />
                <span className="sr-only">分享</span>
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <div>
            <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">简介</TabsTrigger>
                <TabsTrigger value="photos">照片</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
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
                            Weat AI
                          </h3>
                        </div>

                        <h3 className="text-lg font-semibold">评测</h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {restaurant.summary?.summary || "暂无分析内容"}
                          </ReactMarkdown>
                        </div>

                        <h3 className="text-lg font-semibold">标签</h3>
                        <div className="flex flex-wrap gap-2">
                          {(restaurant.tags ?? []).map((tagData, i: number) => (
                            <Badge key={i} variant="outline">
                              {tagData.tag.name}
                              <span className="text-muted-foreground ml-1">
                                {tagData.mention_count}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card id="popular-dishes">
                      <CardContent className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold">热门菜品</h3>

                        <div className="flex flex-col gap-4">
                          {/* Top 3 Column */}
                          <div className="flex flex-col gap-2">
                            {restaurant.dishes
                              ?.slice(0, 3)
                              .map((dish, index: number) => (
                                <div
                                  key={index}
                                  className={`flex items-center gap-2 rounded-lg p-2 transition-all ${
                                    index === 0
                                      ? "border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-100"
                                      : index === 1
                                        ? "border border-gray-200 bg-gradient-to-r from-gray-50 to-slate-100"
                                        : "border border-orange-200 bg-gradient-to-r from-orange-50 to-red-100"
                                  }`}
                                >
                                  <span
                                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium ${
                                      index === 0
                                        ? "bg-yellow-200 text-white"
                                        : index === 1
                                          ? "bg-gray-100 text-white"
                                          : "bg-orange-200 text-white"
                                    }`}
                                  >
                                    {index === 0
                                      ? "🥇"
                                      : index === 1
                                        ? "🥈"
                                        : "🥉"}
                                  </span>
                                  <span className="text-foreground text-sm font-medium">
                                    {dish.name}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="select-none"
                                  >
                                    <MessageCircleMore className="size-3" />
                                    {dish.mention_count}
                                  </Badge>
                                </div>
                              ))}
                          </div>

                          {/* Other dishes Grid */}
                          <div className="grid md:grid-cols-2">
                            {restaurant.dishes
                              ?.slice(3)
                              .map((dish, index: number) => (
                                <div
                                  key={index + 3}
                                  className="hover:bg-muted flex items-center gap-2 rounded-lg px-2 py-1 transition-all md:py-2"
                                >
                                  <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-medium">
                                    {index + 4}
                                  </span>
                                  <span className="text-sm">{dish.name}</span>
                                  <Badge
                                    variant="secondary"
                                    className="select-none"
                                  >
                                    <MessageCircleMore className="size-3" />
                                    {dish.mention_count}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2 xl:col-span-2">
                    <RestaurantContactCard restaurant={restaurant} />
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
        </div>
      </div>
    </>
  );
};
