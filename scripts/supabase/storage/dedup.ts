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

async function main() {
  const bucket = "restaurant-images";
  console.log(chalk.blue(`Deduplicating objects in bucket: ${bucket}`));

  // Step 1: List all restaurant IDs (folders at root)
  const { data: rootFolders, error: rootError } = await supabase.storage
    .from(bucket)
    .list("");

  if (rootError) {
    console.error(chalk.red("Failed to list root folders:"), rootError);
    process.exit(1);
  }

  if (!rootFolders || rootFolders.length === 0) {
    console.log(chalk.yellow("No restaurant folders found."));
    return;
  }

  // Filter to only folders (restaurant IDs)
  const restaurantIds = rootFolders
    .filter((item) => !item.metadata?.mimetype) // Folders don't have mimetype
    .map((item) => item.name);

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
