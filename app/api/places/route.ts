import { backendAPI } from "@/lib/api";
import { API } from "@/types/api";
import bboxPolygon from "@turf/bbox-polygon";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = "/places";

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

  const query = params.get("q");
  const bounds = toBounds(params.get("bounds"));

  console.log(process.env.API_URL);
  const response = await backendAPI.get<API.Paginated<API.Place>>(ENDPOINT, {
    params: {
      page,
      page_size: pageSize,
    },
  });

  console.log(response.data);
  const data = response.data;

  if (query) {
    data.items = data.items.filter((place) => {
      const name = place.name.toLowerCase();
      const nameZh = place.name_zh?.toLowerCase() || "";
      const searchQuery = query.toLowerCase();

      return (
        name.includes(searchQuery) || nameZh.includes(searchQuery) || place.address.toLowerCase().includes(searchQuery)
      );
    });
  } else if (bounds) {
    data.items = data.items.filter((place) => {
      const location = point([place.longitude, place.latitude]);
      return booleanPointInPolygon(location, bounds);
    });
  } else {
    return NextResponse.json({ error: "No query or bounds provided" }, { status: 400 });
  }

  return NextResponse.json(data);
};
