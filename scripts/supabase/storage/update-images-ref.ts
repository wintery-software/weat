#!/usr/bin/env tsx
import { createClient } from "@supabase/supabase-js";
import chalk from "chalk";
import * as dotenv from "dotenv";

dotenv.config();

["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_API_KEY"].forEach((key) => {
  if (!process.env[key]) {
    console.error(chalk.red(`${key} is not set`));
    process.exit(1);
  }
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_API_KEY!,
);

async function listAllImages(
  bucket: string,
  restaurantId: string,
): Promise<any[]> {
  let allImages: any[] = [];
  let page = 0;
  const perPage = 100;
  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(restaurantId, { limit: perPage, offset: page * perPage });
    if (error) {
      console.error(
        chalk.red(`[${restaurantId}] Failed to list images for DB update:`),
        error,
      );
      break;
    }
    if (!data || data.length === 0) break;
    allImages = allImages.concat(data);
    if (data.length < perPage) break;
    page++;
  }
  return allImages;
}

async function listAllRestaurantIds(bucket: string): Promise<string[]> {
  let allFolders: any[] = [];
  let page = 0;
  const perPage = 100;
  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list("", { limit: perPage, offset: page * perPage });
    if (error) {
      console.error(chalk.red("Failed to list root folders:"), error);
      break;
    }
    if (!data || data.length === 0) break;
    allFolders = allFolders.concat(data);
    if (data.length < perPage) break;
    page++;
  }
  return allFolders
    .filter((item) => !item.metadata?.mimetype)
    .map((item) => item.name);
}

async function main() {
  const bucket = "restaurant-images";
  console.log(
    chalk.blue(`Syncing images array for all restaurants in bucket: ${bucket}`),
  );

  // Step 1: List all restaurant IDs (folders at root, paginated)
  const restaurantIds = await listAllRestaurantIds(bucket);

  if (restaurantIds.length === 0) {
    console.log(chalk.yellow("No restaurant folders found."));
    return;
  }

  console.log(chalk.blue(`Found ${restaurantIds.length} restaurants`));

  let totalUpdated = 0;

  // For each restaurant, list all objects and update DB
  for (const restaurantId of restaurantIds) {
    const images = await listAllImages(bucket, restaurantId);

    const imageNames = (images || [])
      .filter((img) => img.metadata?.mimetype)
      .map((img) => img.name); // keep extension

    // Update the restaurant record in the DB
    const { error: updateError } = await supabase
      .from("restaurants")
      .update({ images: imageNames })
      .eq("id", restaurantId);

    if (updateError) {
      console.error(
        chalk.red(`[${restaurantId}] Failed to update images array:`),
        updateError,
      );
    } else {
      console.log(
        chalk.green(
          `[${restaurantId}] Updated images array (${imageNames.length} images)`,
        ),
      );
      totalUpdated++;
    }
  }

  console.log(
    chalk.blue(`Sync complete. Updated ${totalUpdated} restaurants.`),
  );
}

main().catch((err) => {
  console.error(chalk.red("Fatal error:"), err);
  process.exit(1);
});
