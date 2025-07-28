#!/usr/bin/env tsx
import { createClient } from "@supabase/supabase-js";
import chalk from "chalk";
import crypto from "crypto";
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

async function sha256(buffer: Buffer): Promise<string> {
  return crypto.createHash("sha256").update(buffer).digest("hex");
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
  console.log(chalk.blue(`Deduplicating objects in bucket: ${bucket}`));

  // Step 1: List all restaurant IDs (folders at root, paginated)
  const restaurantIds = await listAllRestaurantIds(bucket);

  if (restaurantIds.length === 0) {
    console.log(chalk.yellow("No restaurant folders found."));
    return;
  }

  console.log(chalk.blue(`Found ${restaurantIds.length} restaurants`));

  let totalDeleted = 0;
  let totalRestaurants = 0;

  // Step 2: For each restaurant, list all objects and deduplicate
  for (const restaurantId of restaurantIds) {
    const { data: images, error: imagesError } = await supabase.storage
      .from(bucket)
      .list(restaurantId);

    if (imagesError) {
      console.error(
        chalk.red(`[${restaurantId}] Failed to list images:`),
        imagesError,
      );
      continue;
    }

    if (!images || images.length === 0) {
      console.log(chalk.yellow(`[${restaurantId}] No images found`));
      continue;
    }

    totalRestaurants++;
    console.log(
      chalk.blue(`[${restaurantId}] Processing ${images.length} images`),
    );

    // Step 3: Deduplicate within this restaurant
    const hashMap: Record<string, Array<any>> = {};

    for (const obj of images) {
      // Skip subfolders
      if (!obj.metadata?.mimetype) continue;

      const filePath = `${restaurantId}/${obj.name}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath);

      if (error || !data) {
        console.error(
          chalk.red(`[${restaurantId}] Failed to download ${obj.name}:`),
          error,
        );
        continue;
      }

      const buffer = Buffer.from(await data.arrayBuffer());
      const hash = await sha256(buffer);

      if (!hashMap[hash]) hashMap[hash] = [];
      hashMap[hash].push({
        ...obj,
        filePath,
        created_at: obj.created_at || obj.updated_at || 0,
        updated_at: obj.updated_at || obj.created_at || 0,
      });
    }

    // Delete duplicates, keep the earliest
    for (const [hash, files] of Object.entries(hashMap)) {
      if (files.length <= 1) continue;

      files.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

      const keep = files[0];
      const toDelete = files.slice(1);

      console.log(
        chalk.yellow(
          `[${restaurantId}] Duplicates found: keeping ${keep.filePath}, deleting ${toDelete.map((f) => f.filePath).join(", ")}`,
        ),
      );

      for (const file of toDelete) {
        const { error } = await supabase.storage
          .from(bucket)
          .remove([file.filePath]);

        if (error) {
          console.error(
            chalk.red(`[${restaurantId}] Failed to delete ${file.filePath}:`),
            error,
          );
        } else {
          console.log(
            chalk.green(`[${restaurantId}] Deleted duplicate ${file.filePath}`),
          );
          totalDeleted++;
        }
      }
    }

    // After deduplication, update the images array in the DB
    const { data: updatedImages, error: listError } = await supabase.storage
      .from(bucket)
      .list(restaurantId);

    if (listError) {
      console.error(
        chalk.red(`[${restaurantId}] Failed to list images for DB update:`),
        listError,
      );
      continue;
    }

    const imagePaths = (updatedImages || [])
      .filter((img) => img.metadata?.mimetype)
      .map((img) => `${restaurantId}/${img.name}`);

    // Update the restaurant record in the DB
    const { error: updateError } = await supabase
      .from("restaurants")
      .update({ images: imagePaths })
      .eq("id", restaurantId);

    if (updateError) {
      console.error(
        chalk.red(`[${restaurantId}] Failed to update images in DB:`),
        updateError,
      );
    } else {
      console.log(
        chalk.green(
          `[${restaurantId}] Updated images in DB (${imagePaths.length} images)`,
        ),
      );
    }
  }

  console.log(
    chalk.blue(
      `Processed ${totalRestaurants} restaurants. Deleted ${totalDeleted} duplicate files.`,
    ),
  );
}

main().catch((err) => {
  console.error(chalk.red("Fatal error:"), err);
  process.exit(1);
});
