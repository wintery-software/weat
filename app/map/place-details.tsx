import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Inter } from "@/lib/font";
import { cn } from "@/lib/utils";
import { API } from "@/types/api";
import { parsePhoneNumberWithError } from "libphonenumber-js/min";
import { LucideExternalLink, LucideMapPin, LucidePhone, LucideX } from "lucide-react";
import Link from "next/link";

interface PlaceDetailsProps {
  isOpen: boolean;
  isLoading: boolean;
  place: API.Place;
  setSelectedPlaceId: (id: string | null) => void;
}

const PlaceDetails = ({ isOpen, isLoading, place, setSelectedPlaceId }: PlaceDetailsProps) => (
  <div
    className={cn(
      Inter.className,
      "m-4 w-full text-xs transition-all ease-in-out",
      isOpen ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
    )}
  >
    <Card className="md:max-h-128 max-h-full md:w-96">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <div className="flex-1">
            {isLoading ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <h2 className="text-lg leading-none md:text-xl">{place.name}</h2>
            )}
          </div>
          <Button className="h-4 w-4" size="icon" variant="ghost" onClick={() => setSelectedPlaceId(null)}>
            <LucideX className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          {isLoading ? <Skeleton className="h-4 w-24" /> : <p className="text-xs">{place.name_zh}</p>}
        </CardDescription>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-base font-semibold leading-none md:text-lg">Place Details</h3>
          {!isLoading && (
            <Link
              href={`/places/${place.id}`}
              className="group flex items-center gap-1 text-link hover:underline"
              target="_blank"
            >
              <span className="transition-transform group-hover:translate-x-0.5">View full details</span>
              <LucideExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2" id="place-address">
            <LucideMapPin className="h-4 w-4" />
            <div>
              {isLoading ? (
                <Skeleton className="h-4 w-64" />
              ) : (
                <Link
                  href={place.google_maps_url || "#"}
                  title="Open in Google Maps"
                  className="hover:underline"
                  target="_blank"
                >
                  {place.address}
                </Link>
              )}
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2" id="place-phone">
              <LucidePhone className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : place.phone_number ? (
            <div className="flex items-center gap-2" id="place-phone">
              <Link href={`tel:${place.phone_number}`} className="hover:underline" target="_blank">
                <LucidePhone className="h-4 w-4" />
                <span>{parsePhoneNumberWithError(place.phone_number, "US").formatNational()}</span>
              </Link>
            </div>
          ) : null}
          {isLoading ? (
            <div className="flex items-center gap-2" id="place-website">
              <LucideExternalLink className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : place.website_url ? (
            <div className="flex items-center gap-2" id="place-website">
              <Link href={place.website_url} className="flex items-center gap-2 hover:underline" target="_blank">
                <LucideExternalLink className="h-4 w-4" />
                <span>{new URL(place.website_url).hostname}</span>
              </Link>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default PlaceDetails;
