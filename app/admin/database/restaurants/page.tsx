import { RestaurantData } from "@/app/admin/database/restaurants/restaurant-data";
import { SuspenseWrapper } from "@/components/layouts/suspense-wrapper";
import { getRestaurants } from "@/lib/api/restaurant";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

const Page = () => (
  <SuspenseWrapper>
    <RestaurantData data={getRestaurants()} />
  </SuspenseWrapper>
);

export default Page;
