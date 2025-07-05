"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSuspenseRestaurant } from "@/hooks/use-restaurants";
import {
  Clock,
  ExternalLink,
  Home,
  MapPin,
  Phone,
  Share2,
  Star,
  ThumbsDown,
  ThumbsUp,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import { use } from "react";

export const RestaurantDetail = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { data: restaurant } = useSuspenseRestaurant(id);

  const formatAddress = (address: typeof restaurant.address) => {
    return `${address.address1}, ${address.city}, ${address.state} ${address.zipcode}`;
  };

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
    phone: "(415) 555-1234",
    hours: "11:00 AM - 10:00 PM",
    priceRange: "$$",
    image: "/placeholder.svg",
    gallery: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    description: restaurant.summary.headline,
    popularDishes: ["招牌菜", "特色菜", "推荐菜", "经典菜", "创新菜"],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container py-3">
          <Navbar routes={routes} brandName="Weat" />
        </div>
      </header>

      <main className="flex-1">
        <div
          className="h-64 w-full bg-cover bg-center sm:h-80"
          style={{ backgroundImage: `url(${mockData.image})` }}
        />

        <div className="container py-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {restaurant.name}
              </h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  <span className="mr-1 font-medium">
                    {restaurant.summary.sentimentScore}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < Math.floor(restaurant.summary.sentimentScore)
                            ? "fill-secondary text-secondary"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-muted-foreground mx-2">•</span>
                <div className="flex flex-wrap gap-2">
                  {restaurant.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                    {mockData.priceRange}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Share2 className="mr-1 size-4" />
                Share
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a
                  href={restaurant.externalLinks.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-1 size-4" />
                  Open in Maps
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">About</h3>
                      <p className="text-muted-foreground mt-2">
                        {mockData.description}
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-primary size-4" />
                          <span className="text-sm">
                            {formatAddress(restaurant.address)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="text-primary size-4" />
                          <span className="text-sm">{mockData.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="text-primary size-4" />
                          <span className="text-sm">{mockData.hours}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">Popular Dishes</h3>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {mockData.popularDishes.map((dish, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                              {index + 1}
                            </span>
                            <span>{dish}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="photos" className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">Photo Gallery</h3>
                      <div className="mt-2 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {mockData.gallery.map((photo, index) => (
                          <div
                            key={index}
                            className="aspect-square overflow-hidden rounded-md"
                          >
                            <Image
                              src={photo || "/placeholder.svg"}
                              alt={`${restaurant.name} photo ${index + 1}`}
                              fill
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ai-insights" className="mt-4 space-y-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold">AI-Generated Summary</h3>
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-medium">
                            {Math.round(restaurant.summary.sentimentScore * 20)}
                            %
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-5 w-5 text-green-500" />
                            <h4 className="font-medium">What People Love</h4>
                          </div>
                          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
                            {restaurant.summary.aspects.taste.map(
                              (aspect, index) => (
                                <li key={index}>{aspect}</li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <ThumbsDown className="h-5 w-5 text-red-500" />
                            <h4 className="font-medium">Service Highlights</h4>
                          </div>
                          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
                            {restaurant.summary.aspects.service.map(
                              (aspect, index) => (
                                <li key={index}>{aspect}</li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-5 w-5 text-blue-500" />
                            <h4 className="font-medium">Environment</h4>
                          </div>
                          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
                            {restaurant.summary.aspects.environment.map(
                              (aspect, index) => (
                                <li key={index}>{aspect}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold">Keyword Clusters</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {restaurant.summary.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="bg-muted rounded-full px-3 py-1 text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Card className="sticky top-20">
                <CardContent className="p-4">
                  <h3 className="font-bold">Location</h3>
                  <div className="bg-muted mt-2 aspect-square overflow-hidden rounded-md">
                    <div className="h-full w-full bg-[url('/placeholder.svg')] bg-cover bg-center"></div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-primary size-4" />
                      <span>{formatAddress(restaurant.address)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-primary size-4" />
                      <span>{mockData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-primary size-4" />
                      <span>{mockData.hours}</span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full" asChild>
                    <a
                      href={restaurant.externalLinks.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-muted-foreground text-center text-sm md:text-left">
            &copy; {new Date().getFullYear()} ChineseEats. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
