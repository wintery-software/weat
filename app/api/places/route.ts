import { backendAPI } from "@/lib/api";
import { API } from "@/types/api";
import bboxPolygon from "@turf/bbox-polygon";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { NextRequest, NextResponse } from "next/server";

const toBounds = (value: string | null) => {
  if (!value) {
    return null;
  }

  const [west, south, east, north] = value.split(",").map(parseFloat);
  return bboxPolygon([west, south, east, north]);
};

export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;

  const page = params.get("page");
  const pageSize = params.get("page_size");

  const bounds = toBounds(params.get("bounds"));

  const response = await backendAPI.get<API.Paginated<API.Place>>("/places", {
    params: {
      page,
      page_size: pageSize,
    },
  });

  const data = response.data;

  if (bounds) {
    data.items = data.items.filter((place) => {
      const location = point([place.location.longitude, place.location.latitude]);
      return booleanPointInPolygon(location, bounds);
    });
  } else {
    return NextResponse.json({ error: "Missing bounds" }, { status: 400 });
  }

  return NextResponse.json(data);
};
