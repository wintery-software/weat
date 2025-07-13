import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { AI_NAME } from "@/lib/constants";
import {
  Clock,
  MapPin,
  Phone,
  Sparkles,
  StoreIcon,
  TrophyIcon,
} from "lucide-react";

// Skeleton for RestaurantActions
export const RestaurantActionsSkeleton = () => (
  <div className="flex gap-2">
    <Skeleton className="h-10 w-10 rounded-md" />
    <Skeleton className="h-10 w-10 rounded-md" />
  </div>
);

// Skeleton for RestaurantAiInsights
export const RestaurantAiInsightsSkeleton = () => (
  <Card className="bg-gradient-to-br from-rose-50 via-white via-25% to-violet-50">
    <CardHeader className="flex items-center gap-2 select-none">
      <Sparkles className="text-violet-600" />
      <h2 className="bg-gradient-to-r from-violet-500 to-rose-400 bg-clip-text text-transparent select-none">
        {AI_NAME}
      </h2>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <h3>评测</h3>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3>标签</h3>
          <span className="text-muted-foreground text-sm">
            <Skeleton className="inline-block h-4 w-6 align-middle" />
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-14 rounded-full" />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Skeleton for RestaurantDishes
export const RestaurantDishesSkeleton = () => (
  <Card>
    <CardHeader className="flex items-center gap-2 select-none">
      <TrophyIcon className="size-5" />
      <h2>热门菜品</h2>
      <span className="text-muted-foreground text-sm font-normal">
        <Skeleton className="inline-block h-4 w-6 align-middle" />
      </span>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      {/* Top 3 Column */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`bg-muted/30 flex items-center gap-2 rounded-lg border p-2 transition-all`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border bg-gray-200 text-xs font-medium text-white">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </span>
            <span className="text-foreground text-sm font-medium">
              <Skeleton className="h-4 w-20" />
            </span>
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        ))}
      </div>
      {/* Other dishes Grid */}
      <div className="grid gap-0.5 md:grid-cols-2 md:gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="hover:bg-muted flex items-center gap-2 rounded-lg px-2 py-1 transition-all md:py-2"
          >
            <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-medium">
              {index + 4}
            </span>
            <span className="text-sm">
              <Skeleton className="h-4 w-16" />
            </span>
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Skeleton for RestaurantInfo
export const RestaurantInfoSkeleton = () => (
  <Card className="lg:col-span-2 xl:col-span-2">
    <CardHeader className="flex items-center gap-2 select-none">
      <StoreIcon className="size-5" />
      <h2>餐厅信息</h2>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md border">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary size-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Phone className="text-primary size-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Clock className="text-primary size-4" />
          <span>11:00 AM - 9:00 PM</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex gap-2">
      <Skeleton className="h-10 w-24 rounded-md" />
      <Skeleton className="h-10 w-24 rounded-md" />
    </CardFooter>
  </Card>
);

export const RestaurantSkeleton = () => (
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
            <h1>
              <Skeleton className="mb-1 inline-block h-6 w-32 align-middle" />
            </h1>
            <span className="text-muted-foreground text-sm">
              <Skeleton className="inline-block h-4 w-24 align-middle" />
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>
              <Skeleton className="inline-block h-4 w-6 align-middle" />
            </span>
            <Skeleton className="h-4 w-16" />
            <span className="text-muted-foreground">
              (<Skeleton className="inline-block h-4 w-8 align-middle" />)
            </span>
          </div>
        </div>
        <RestaurantActionsSkeleton />
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-16" />
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-2 lg:grid-cols-5 xl:grid-cols-6">
            <div className="flex flex-col gap-2 lg:col-span-3 xl:col-span-4">
              <RestaurantAiInsightsSkeleton />
              <RestaurantDishesSkeleton />
            </div>
            <div className="lg:col-span-2 xl:col-span-2">
              <RestaurantInfoSkeleton />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="photos">
          <Card>
            <CardContent className="relative">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="text-muted-foreground self-end text-xs">
        <span>最近更新于:&nbsp;</span>
        <Popover>
          <PopoverTrigger>
            <span className="flex cursor-pointer items-center gap-1 underline decoration-dotted underline-offset-2">
              <Skeleton className="inline-block h-4 w-24 align-middle" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </span>
          </PopoverTrigger>
          <PopoverContent className="p-2 text-xs">
            Weat 会周期性地更新餐厅信息，以确保信息的准确性和时效性。
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </>
);
