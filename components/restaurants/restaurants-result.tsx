import { type RestaurantsResponse } from "@/app/api/restaurants/route";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { RestaurantsResultCard } from "@/components/restaurants/restaurants-result-card";
import type { ViewMode } from "@/types/types";
import type {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

interface RestaurantsResultProps {
  restaurants: RestaurantsResponse[];
  view: ViewMode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult>;
}

const viewClassNames: Record<ViewMode, string> = {
  grid: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  list: "flex flex-col gap-2",
  map: "",
};

export const RestaurantsResult = ({
  restaurants,
  view,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: RestaurantsResultProps) => (
  <InfiniteScroll
    hasNextPage={hasNextPage}
    isFetchingNextPage={isFetchingNextPage}
    onLoadMore={onLoadMore}
    endMessage={
      restaurants.length > 0 ? (
        <div className="text-sm">
          <span className="text-muted-foreground">已显示所有</span>
          &nbsp;
          <span className="font-medium">{restaurants.length}</span>
          &nbsp;
          <span className="text-muted-foreground">家餐厅</span>
        </div>
      ) : undefined
    }
    className="flex flex-col gap-4"
  >
    {/* Results */}
    <div className={viewClassNames[view]}>
      {restaurants.map((restaurant) => (
        <RestaurantsResultCard
          key={restaurant.id}
          restaurant={restaurant}
          view={view}
        />
      ))}
    </div>
  </InfiniteScroll>
);
