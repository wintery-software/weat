import { TaskQueueStatusCard } from "@/app/admin/task-queue-status-card";
import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  getRestaurantsCount,
  getRestaurantSummariesCount,
  getUniqueTaggedRestaurantsCount,
} from "@/lib/api/restaurant";
import { getReviewsCount } from "@/lib/api/review";
import { getTagsCount } from "@/lib/api/tag";
import { getTaskQueueStatus } from "@/lib/api/task-queue";
import { StarIcon, TagsIcon, UtensilsIcon } from "lucide-react";
import Link from "next/link";

const Page = async () => {
  const restaurantsCount = Number(await getRestaurantsCount());
  const restaurantSummariesCount = Number(await getRestaurantSummariesCount());
  const uniqueTaggedRestaurantsCount = Number(
    await getUniqueTaggedRestaurantsCount(),
  );
  const tagsCount = Number(await getTagsCount());
  const reviewsCount = Number(await getReviewsCount());

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-medium">Welcome back, Admin!</h2>
      <div className="flex flex-col gap-4">
        <Label htmlFor="database-overview" className="text-muted-foreground">
          Database Overview
        </Label>
        <div
          id="database-overview"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
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
                <p className="text-2xl font-semibold">
                  {restaurantsCount.toLocaleString()}
                </p>
                <div className="flex flex-col">
                  <p className="flex text-sm">
                    <span className="font-semibold">
                      {restaurantSummariesCount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      &nbsp;summarized&nbsp;(
                    </span>
                    <span className="font-semibold">
                      {restaurantsCount - restaurantSummariesCount}
                    </span>
                    <span className="text-muted-foreground">&nbsp;left)</span>
                  </p>
                  <p className="flex text-sm">
                    <span className="font-semibold">
                      {uniqueTaggedRestaurantsCount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      &nbsp;tagged&nbsp;(
                    </span>
                    <span className="font-semibold">
                      {restaurantsCount - uniqueTaggedRestaurantsCount}
                    </span>
                    <span className="text-muted-foreground">&nbsp;left)</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <p className="text-2xl font-semibold">
                {tagsCount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>
                <Link
                  href="/admin/database/reviews"
                  className="flex items-center gap-2 font-medium underline-offset-2 hover:underline"
                >
                  <StarIcon className="size-4" />
                  Total Reviews
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {reviewsCount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Label htmlFor="aggregated-data" className="text-muted-foreground">
          Aggregated Data
        </Label>
        <div
          id="aggregated-data"
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <SuspenseWrapper>
            <TaskQueueStatusCard status={getTaskQueueStatus()} />
          </SuspenseWrapper>
        </div>
      </div>
    </div>
  );
};

export default Page;
