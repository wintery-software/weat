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
import { formatAddress } from "@/lib/utils";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import {
  Clock,
  Dot,
  Home,
  MapPin,
  Phone,
  Route,
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
    phone: restaurant.phoneNumber || "-",
    hours: "11:00 AM - 10:00 PM",
    priceRange: "$$",
    image: "/placeholder.svg",
    gallery: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    description: restaurant.summary?.summary || "没有描述",
    popularDishes: restaurant.dishes?.map((dish) => dish.name) || [
      "招牌菜",
      "特色菜",
      "推荐菜",
      "经典菜",
      "创新菜",
    ],
  };

  // Calculate rating from averageRating
  const rating = restaurant.summary?.averageRating
    ? parseFloat(restaurant.summary.averageRating.toString())
    : 0;

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
                  {restaurant.nameZh || restaurant.nameEn}
                </h1>
                <p className="text-muted-foreground">
                  {restaurant.nameEn || restaurant.nameZh}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div id="rating" className="flex items-center gap-2">
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <Rating value={rating} size={16} />
                </div>
                <Dot className="text-muted-foreground hidden size-4 sm:block" />
                <div id="tags" className="flex flex-wrap gap-2">
                  {(restaurant.tags ?? []).map((tag, i: number) => (
                    <Badge key={tag?.id ?? i} variant="default">
                      {tag?.tag?.name}
                    </Badge>
                  ))}
                  <Badge variant="outline">{mockData.priceRange}</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <a
                  href={
                    restaurant.googleMapsPlaceId
                      ? `https://www.google.com/maps/place/?q=place_id:${restaurant.googleMapsPlaceId}`
                      : "#"
                  }
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

                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {restaurant.summary?.summary || "暂无分析内容"}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>

                      <Card id="popular-dishes">
                        <CardContent className="flex flex-col gap-4">
                          <h3 className="text-lg font-semibold">热门菜品</h3>

                          <div className="grid gap-2 sm:grid-cols-2">
                            {mockData.popularDishes.map(
                              (dish: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                                    {index + 1}
                                  </span>
                                  <span>{dish}</span>
                                </div>
                              ),
                            )}
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
                                title={restaurant.nameZh || restaurant.nameEn}
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
                            <Link
                              href={
                                restaurant.googleMapsPlaceId
                                  ? `https://www.google.com/maps/place/?q=place_id:${restaurant.googleMapsPlaceId}`
                                  : "#"
                              }
                              className="hover:underline"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {formatAddress(restaurant.address)}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="text-primary size-4" />
                            <Link
                              href={`tel:${mockData.phone}`}
                              className="hover:underline"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {mockData.phone}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="text-primary size-4" />
                            <span>{mockData.hours}</span>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          asChild
                          disabled={!restaurant.googleMapsPlaceId}
                        >
                          <a
                            href={
                              restaurant.googleMapsPlaceId
                                ? `https://www.google.com/maps/place/?q=place_id:${restaurant.googleMapsPlaceId}`
                                : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Route className="size-4" />
                            开始导航
                          </a>
                        </Button>
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
                                    alt={`${restaurant.nameZh || restaurant.nameEn || "-"} photo ${index + 1}`}
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
                              alt={`${restaurant.nameZh || restaurant.nameEn || "-"} photo ${index + 1}`}
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
