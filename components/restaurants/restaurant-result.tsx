import { type RestaurantsData } from "@/app/api/restaurants/route";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { RestaurantResultCard } from "@/components/restaurants/restaurant-result-card";
import type { ViewMode } from "@/types/types";
import type {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

interface RestaurantResultProps {
  restaurants: RestaurantsData[];
  view: ViewMode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult>;
  totalCount: number;
}

export const RestaurantResult = ({
  restaurants,
  view,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  totalCount,
}: RestaurantResultProps) => (
  <InfiniteScroll
    hasNextPage={hasNextPage}
    isFetchingNextPage={isFetchingNextPage}
    onLoadMore={onLoadMore}
    endMessage={
      restaurants.length > 0 ? (
        <div className="text-sm">
          <span className="text-muted-foreground">已显示所有</span>
          &nbsp;
          <span className="font-medium">{totalCount}</span>
          &nbsp;
          <span className="text-muted-foreground">家餐厅</span>
        </div>
      ) : undefined
    }
    className="flex flex-col gap-4"
  >
    {/* Results */}
    <div
      className={
        view === "grid"
          ? "grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "flex flex-col gap-2"
      }
    >
      {restaurants.map((restaurant) => (
        <RestaurantResultCard
          key={restaurant.id}
          restaurant={restaurant}
          view={view}
        />
      ))}
    </div>
  </InfiniteScroll>
);
