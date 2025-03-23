import { readPlaces } from "@/db/data/csv";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const query = params.get("q");
  const sanitizedQuery = query?.trim().toLowerCase() || "";
  const boundsParam = params.get("bounds");
  const limit = parseInt(params.get("limit") || "", 10);

  // Parse bounds from "south,west,north,east" format
  let bounds = null;

  if (boundsParam) {
    try {
      const [south, west, north, east] = boundsParam.split(",").map(parseFloat);

      if (!isNaN(south) && !isNaN(west) && !isNaN(north) && !isNaN(east)) {
        bounds = { south, west, north, east };
      }
    } catch {
      return NextResponse.json(
        { error: `Invalid bounds (not 'south,west,north,east'): ${boundsParam}` },
        { status: 400 },
      );
    }
  }

  const places = await readPlaces();
  let result = places;

  // Filter places within bounds if provided
  if (bounds) {
    result = places.filter((place) => {
      const { lat, lng } = place.position;
      return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
    });
  }

  // Filter places by query
  if (sanitizedQuery) {
    result = places.filter(
      (place) =>
        place.names.some((name) => name.text?.toLowerCase().includes(sanitizedQuery)) ||
        place.types.some((type) => type.toLowerCase().includes(sanitizedQuery)) ||
        place.address.toLowerCase().includes(sanitizedQuery),
    );
  }

  // Limit the number of results if provided
  if (!isNaN(limit)) {
    result = result.slice(0, limit);
  }

  return NextResponse.json(result);
};
