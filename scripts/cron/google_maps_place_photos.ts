#!/usr/bin/env tsx

import { getGoogleMapsPlacePhotoUrl } from "@/lib/google-maps";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import chalk from "chalk";
import * as dotenv from "dotenv";
import { fileTypeFromBuffer } from "file-type/core";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

[
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  "SUPABASE_SERVICE_API_KEY",
  "RESTAURANT_IMAGES_BUCKET",
].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const IMAGES_COUNT = 10;
const MAX_IMAGE_SIZE = {
  width: 1600,
  height: 1600,
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_API_KEY!,
);

// Parse optional count argument from command line
const argCount = process.argv[2] ? parseInt(process.argv[2], 10) : undefined;

const getRestaurantsWithPlaceId = async (count?: number) => {
  // Join restaurants.place_id = places.id to get google_maps_place_id
  let query = supabase
    .from("restaurants")
    .select("id, place:places(google_maps_place_id)");

  if (count) {
    query = query.limit(count);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // Filter out restaurants without a google_maps_place_id
  return (data || [])
    .filter((r: any) => r.place && r.place.google_maps_place_id)
    .map((r: any) => ({
      id: r.id,
      google_maps_place_id: r.place.google_maps_place_id,
    }));
};

const getPhotoReferences = async (placeId: string): Promise<string[]> => {
  // Use Places API (New) to get up to 5 photo references
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=photos`;

  const response = await axios.get(url, {
    headers: {
      "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      "X-Goog-FieldMask": "photos",
    },
  });

  const photos = response.data.photos || [];

  return photos.slice(0, IMAGES_COUNT).map((p: { name: string }) => p.name);
};

const downloadPhoto = async (
  photoName: string,
): Promise<{ buffer: Buffer; ext: string }> => {
  // Use helper method to get the photo URL
  const url = getGoogleMapsPlacePhotoUrl(
    photoName,
    MAX_IMAGE_SIZE.height,
    MAX_IMAGE_SIZE.width,
  );

  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const buffer = Buffer.from(response.data);
  const type = await fileTypeFromBuffer(buffer);

  if (!type) {
    throw new Error("Could not determine file type");
  }

  return { buffer, ext: type.ext };
};

const uploadToSupabase = async (
  restaurantId: string,
  ext: string,
  buffer: Buffer,
) => {
  const uuid = uuidv4();
  const filePath = `${restaurantId}/${uuid}.${ext}`;
  const { error } = await supabase.storage
    .from(process.env.RESTAURANT_IMAGES_BUCKET!)
    .upload(filePath, buffer, {
      contentType: `image/${ext}`,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  console.log(`[${restaurantId}] Uploaded ${filePath}`);

  return `${uuid}.${ext}`;
};

const main = async () => {
  const restaurants = await getRestaurantsWithPlaceId(argCount);

  console.log(
    `Processing ${restaurants.length} restaurants${argCount ? ` (limit: ${argCount})` : ""}.`,
  );

  for (const restaurant of restaurants) {
    const { id, google_maps_place_id } = restaurant;
    const uploadedImages: string[] = [];

    try {
      const photoRefs = await getPhotoReferences(google_maps_place_id);

      if (photoRefs.length === 0) {
        console.log(chalk.yellow(`[${id}] No photos`));
        continue;
      }

      for (const photoRef of photoRefs) {
        try {
          const { buffer, ext } = await downloadPhoto(photoRef);
          const path = await uploadToSupabase(id, ext, buffer);
          uploadedImages.push(path);
        } catch (err) {
          console.error(chalk.red(`[${id}] Failed to process photo:`, err));
        }
      }

      // Update restaurant with uploaded image paths
      if (uploadedImages.length > 0) {
        const { error: updateError } = await supabase
          .from("restaurants")
          .update({ images: uploadedImages })
          .eq("id", id);

        if (updateError) {
          console.error(
            chalk.red(`[${id}] Failed to update with images:`, updateError),
          );
        } else {
          console.log(
            chalk.green(`[${id}] Updated ${uploadedImages.length} images`),
          );
        }
      }
    } catch (err) {
      console.error(chalk.red(`[${id}] Failed to process:`), err);
    }
  }
};

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
