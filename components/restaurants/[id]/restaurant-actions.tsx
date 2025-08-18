"use client";

import { type GetRestaurantResponse } from "@/app/restaurants/[id]/actions";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants/app";
import { Navigation, Share } from "lucide-react";

interface RestaurantActionsProps {
  restaurant: GetRestaurantResponse;
}

export const RestaurantActions = ({ restaurant }: RestaurantActionsProps) => {
  const handleNavigationClick = () => {
    const infoElement = document.getElementById("info");

    if (infoElement) {
      infoElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleShareClick = async () => {
    const shareData = {
      title: `我在 ${APP_NAME} 上发现了一家餐厅：${restaurant.name_zh || restaurant.name_en}，快来看看吧！`,
      url: `${window.location.origin}/restaurants/${restaurant.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      }
    } catch (error) {
      // Ignore share canceled errors
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size={"icon"}
        variant="secondary"
        title="导航"
        className="cursor-pointer"
        onClick={handleNavigationClick}
      >
        <Navigation />
      </Button>
      <Button
        size={"icon"}
        variant="secondary"
        title="分享"
        className="cursor-pointer"
        onClick={handleShareClick}
      >
        <Share />
      </Button>
    </div>
  );
};
