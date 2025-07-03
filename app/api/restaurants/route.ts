import restaurantsData from "@/data/restaurants.json";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // Simulate a small delay to mimic real API behavior
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: restaurantsData.restaurants,
      count: restaurantsData.restaurants.length,
    });
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch restaurants",
      },
      { status: 500 },
    );
  }
};
