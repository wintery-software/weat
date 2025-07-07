"use client";

import { Navbar } from "@/components/navbar";
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
import { useSuspenseRestaurant } from "@/hooks/use-restaurants";
import {
  getAppleMapsSearchUrl,
  getGoogleMapsSearchUrl,
} from "@/lib/navigation";
import { formatAddress } from "@/lib/utils";
import { SiApple, SiGooglemaps } from "@icons-pack/react-simple-icons";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import {
  Clock,
  Home,
  MapPin,
  MessageCircleMore,
  Phone,
  Share2,
  Sparkles,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const RestaurantDetail = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { data: restaurant } = useSuspenseRestaurant(id);
  const [currentTab, setCurrentTab] = useState("overview");

  if (!restaurant) {
    return <div className="container py-6">餐厅信息未找到。</div>;
  }

  // Navigation routes
  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="size-4" />,
    },
    {
      href: "/restaurants",
      label: "Restaurants",
      icon: <Utensils className="size-4" />,
    },
  ];

  // Mock data for fields not in our Restaurant interface
  const mockData = {
    hours: "11:00 AM - 10:00 PM",
    image: "/placeholder.svg",
    gallery: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container py-3">
          <Navbar routes={routes} />
        </div>
      </header>

      <main className="flex-1">
        <div
          className="h-64 w-full bg-cover bg-center sm:h-80"
          style={{ backgroundImage: `url(${mockData.image})` }}
        />

        <div className="container py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <div id="name">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {restaurant.name_zh || restaurant.name_en}
                </h1>
                <p className="text-muted-foreground">
                  {restaurant.name_en || restaurant.name_zh}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
              <Button size="sm" variant="outline" asChild>
                <a
                  href={getGoogleMapsSearchUrl({
                    placeId: restaurant.google_maps_place_id,
                    name: restaurant.name_en ?? restaurant.name_zh,
                    address: formatAddress(restaurant.address),
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="size-4" />
                  Google Maps
                </a>
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="size-4" />
                分享
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <div>
              <Tabs
                value={currentTab}
                onValueChange={(val) => {
                  setCurrentTab(val as string);
                }}
              >
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
                            {(restaurant.tags ?? []).map(
                              (tagData, i: number) => (
                                <Badge key={i} variant="outline">
                                  {tagData.tag.name}
                                  <span className="text-muted-foreground ml-1">
                                    {tagData.mention_count}
                                  </span>
                                </Badge>
                              ),
                            )}
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
                                        ? "border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-100 shadow-sm"
                                        : index === 1
                                          ? "border border-gray-200 bg-gradient-to-r from-gray-50 to-slate-100 shadow-sm"
                                          : "border border-orange-200 bg-gradient-to-r from-orange-50 to-red-100 shadow-sm"
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
                                    <Badge variant="outline">
                                      <MessageCircleMore className="size-3" />
                                      {dish.mention_count}
                                    </Badge>
                                  </div>
                                ))}
                            </div>

                            {/* Other dishes Grid */}
                            <div className="grid sm:grid-cols-2">
                              {restaurant.dishes
                                ?.slice(3)
                                .map((dish, index: number) => (
                                  <div
                                    key={index + 3}
                                    className="hover:bg-muted/50 flex items-center gap-2 rounded-lg p-2 transition-all"
                                  >
                                    <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-medium">
                                      {index + 4}
                                    </span>
                                    <span className="text-sm">{dish.name}</span>
                                    <Badge variant="secondary">
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

                    <Card id="location" className="lg:col-span-2 xl:col-span-2">
                      <CardContent className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold">地址</h3>
                        <div className="aspect-square overflow-hidden rounded-md border">
                          {restaurant.latitude && restaurant.longitude ? (
                            <Map
                              defaultZoom={15}
                              defaultCenter={{
                                lat: restaurant.latitude,
                                lng: restaurant.longitude,
                              }}
                              mapId="#"
                              className="h-full w-full"
                              gestureHandling="greedy"
                              disableDefaultUI
                              zoomControl={true}
                              scrollwheel={true}
                            >
                              <AdvancedMarker
                                position={{
                                  lat: restaurant.latitude,
                                  lng: restaurant.longitude,
                                }}
                                title={restaurant.name_zh || restaurant.name_en}
                              />
                            </Map>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <p className="text-muted-foreground text-sm">
                                暂无位置信息
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="text-primary size-4" />
                            {formatAddress(restaurant.address)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="text-primary size-4" />
                            <Link
                              href={`tel:${restaurant.phone_number}`}
                              className="hover:underline"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {restaurant.phone_number}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="text-primary size-4" />
                            <span>{mockData.hours}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            asChild
                            disabled={!restaurant.google_maps_place_id}
                          >
                            <a
                              href={getGoogleMapsSearchUrl({
                                placeId: restaurant.google_maps_place_id,
                                name: restaurant.name_en ?? restaurant.name_zh,
                                address: formatAddress(restaurant.address),
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <SiGooglemaps className="size-4" />
                              <span>Google&nbsp;Maps</span>
                            </a>
                          </Button>
                          <Button
                            className="flex-1"
                            asChild
                            disabled={
                              !restaurant.latitude || !restaurant.longitude
                            }
                          >
                            <a
                              href={getAppleMapsSearchUrl({
                                name: restaurant.name_en ?? restaurant.name_zh,
                                address: formatAddress(restaurant.address),
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <SiApple className="size-4" />
                              <span>Apple&nbsp;Maps</span>
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="photos">
                  <Card id="photos">
                    <CardContent>
                      {/* Carousel for mobile */}
                      <div className="sm:hidden">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {mockData.gallery.map((photo, index) => (
                              <CarouselItem key={index}>
                                <div className="group relative aspect-square overflow-hidden rounded-lg">
                                  <Image
                                    src={photo || "/placeholder.svg"}
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
                      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                        {mockData.gallery.map((photo, index) => (
                          <div
                            key={index}
                            className="group relative aspect-square overflow-hidden rounded-lg"
                          >
                            <Image
                              src={photo || "/placeholder.svg"}
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
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-muted-foreground text-center text-sm md:text-left">
            &copy; {new Date().getFullYear()} Wintery Software. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
