import * as fs from "fs";
import * as path from "path";
import { generateMockRestaurants } from "../lib/mock-data";

// Generate 500 restaurants
const restaurants = generateMockRestaurants(500);

// Create the data structure
const restaurantsData = {
  restaurants: restaurants,
};

// Convert to JSON string with proper formatting
const jsonData = JSON.stringify(restaurantsData, null, 2);

// Write to file
const outputPath = path.join(__dirname, "../data/restaurants.json");
fs.writeFileSync(outputPath, jsonData, "utf8");

console.log(
  `Generated ${restaurants.length} restaurants and saved to ${outputPath}`,
);
console.log("Sample restaurant IDs:");
restaurants.slice(0, 5).forEach((restaurant, index) => {
  console.log(`${index + 1}. ${restaurant.name} - ID: ${restaurant.id}`);
});
