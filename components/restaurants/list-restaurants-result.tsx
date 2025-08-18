import { type ListRestaurantsResponseData } from "@/app/restaurants/actions";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ListRestaurantsCard } from "@/components/restaurants/list-restaurants-card";
import { type RestaurantResultsViewMode } from "@/types/restaurants";
import type {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

interface RestaurantsListProps {
  restaurants: ListRestaurantsResponseData[];
  view: RestaurantResultsViewMode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult>;
}

const viewClassNames: Record<RestaurantResultsViewMode, string> = {
  grid: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  list: "flex flex-col gap-2",
  map: "",
};

export const ListRestaurantsResult = ({
  restaurants,
  view,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: RestaurantsListProps) => (
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
        <ListRestaurantsCard
          key={restaurant.id}
          restaurant={restaurant}
          view={view}
        />
      ))}
    </div>
  </InfiniteScroll>
);
