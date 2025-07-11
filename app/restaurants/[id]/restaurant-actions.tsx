"use client";

import { RestaurantGETResponse } from "@/app/api/restaurants/[id]/route";
import { Button } from "@/components/ui/button";
import { Navigation, Share } from "lucide-react";

interface RestaurantActionsProps {
  restaurant: RestaurantGETResponse;
}

export const RestaurantActions = ({ restaurant }: RestaurantActionsProps) => {
  const handleNavigationClick = () => {
    const contactElement = document.getElementById("contact");

    if (contactElement) {
      contactElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleShareClick = async () => {
    const shareData = {
      title: `我在 Weat 上发现了一家餐厅：${restaurant.name_zh || restaurant.name_en}，快来看看吧！`,
      url: `${window.location.origin}/restaurants/${restaurant.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      }
    } catch (error) {
      console.error("Error sharing:", error);
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
        <span className="sr-only">导航</span>
      </Button>
      <Button
        size={"icon"}
        variant="secondary"
        title="分享"
        className="cursor-pointer"
        onClick={handleShareClick}
      >
        <Share />
        <span className="sr-only">分享</span>
      </Button>
    </div>
  );
};
