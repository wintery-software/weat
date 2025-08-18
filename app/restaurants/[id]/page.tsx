import { getRestaurant } from "@/app/restaurants/[id]/actions";
import { RestaurantActions } from "@/components/restaurants/[id]/restaurant-actions";
import { RestaurantInfo } from "@/components/restaurants/[id]/restaurant-info";
import { RestaurantMap } from "@/components/restaurants/[id]/restaurant-map";
import { RestaurantPhotos } from "@/components/restaurants/[id]/restaurant-photos";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleQuestionMarkIcon } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const restaurant = await getRestaurant(id);

  return (
    <>
      {/* Restaurant Map */}
      <RestaurantMap
        title={restaurant.name_zh || restaurant.name_en || ""}
        lat={restaurant.place.latitude}
        lng={restaurant.place.longitude}
      />

      {/* Main content */}
      <div className="container flex flex-col gap-4 py-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <div>
              <h1>{restaurant.name_zh || restaurant.name_en}</h1>
              {restaurant.name_zh && (
                <p className="text-muted-foreground text-sm font-medium">
                  {restaurant.name_en}
                </p>
              )}
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
            <RestaurantInfo restaurant={restaurant} />
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
