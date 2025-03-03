import { readPlaces } from "@/lib/data/utils";
import { NextResponse } from "next/server";

export const GET = async () => {
  const places = await readPlaces();
  return NextResponse.json(places);
};
