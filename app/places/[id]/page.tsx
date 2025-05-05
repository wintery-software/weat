"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlaceQuery } from "@/hooks/map/use-places";
import { LucideExternalLink, LucidePhone, LucideRoute } from "lucide-react";
// Import your Skeleton component
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch place data using the id
  const placeQuery = usePlaceQuery(id);
  const isLoading = placeQuery.isLoading;
  const place = placeQuery.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2" id="names">
        {isLoading ? (
          <Skeleton className="h-8 w-1/2" /> // Matches text height
        ) : (
          <h1>{place?.name}</h1>
        )}
        {isLoading ? (
          <Skeleton className="h-5 w-1/6" /> // Matches smaller text height
        ) : (
          <p className="text-sm text-muted-foreground">{place?.name_zh}</p>
        )}
      </div>

      <div className="flex gap-2" id="type">
        {isLoading ? (
          <Skeleton className="h-5 w-16" /> // Matches badge height
        ) : (
          <Badge>{place?.type}</Badge>
        )}
      </div>

      <div className="flex items-center gap-2" id="address">
        {isLoading ? (
          <Skeleton className="h-5 w-1/2" /> // Matches link text height
        ) : (
          <Link
            href={place?.google_maps_url || "#"}
            title="Open in Google Maps"
            target="_blank"
            className="flex items-center gap-1 text-sm hover:underline"
          >
            {place?.address}
            <LucideExternalLink className="size-3.5" />
          </Link>
        )}
        <div className="flex items-center gap-1 text-sm text-muted-foreground" id="distance">
          <LucideRoute className="size-3.5" />
          {isLoading ? <Skeleton className="h-5 w-12" /> : "3 mi"}
        </div>
      </div>

      <div id="contact">
        <h2 className="mb-2">Contact</h2>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="flex items-center gap-1 text-sm">
            <LucidePhone className="size-3.5" />
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : place?.phone_number ? (
              <Link href={`tel:${place.phone_number}`} className="text-sm hover:underline">
                {place.phone_number}
              </Link>
            ) : (
              "N/A"
            )}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <LucideRoute className="size-3.5" />
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : place?.website_url ? (
              <Link href={place.website_url} target="_blank" className="text-sm hover:underline">
                {place.website_url}
              </Link>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
