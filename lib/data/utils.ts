"use server";

import { parse } from "csv-parse/sync";
import fs from "fs/promises";
import { randomUUID } from "node:crypto";
import path from "path";

interface CSVPlace {
  name: string;
  name_translation?: string;
  address: string;
  google_maps_url: string;
  latitude: number;
  longitude: number;
}

interface CSVRestaurantPlace extends CSVPlace {
  cuisine?: string;
}

interface CSVParkPlace extends CSVPlace {
  type?: string;
  admission_fee?: string;
  dog_policy?: string;
  dog_policy_url?: string;
}

type CSVAnyPlace = CSVPlace | CSVRestaurantPlace | CSVParkPlace;

export const readPlaces = async () => {
  const dir = __dirname;
  const files: {
    file: string;
    category: Weat.PlaceType;
  }[] = [
    {
      file: path.join(dir, "places_metadata - restaurants.csv"),
      category: "restaurant",
    },
    {
      file: path.join(dir, "places_metadata - drinks & snacks.csv"),
      category: "drink",
    },
    {
      file: path.join(dir, "places_metadata - parks.csv"),
      category: "park",
    },
  ];

  const results: Weat.Place[] = await Promise.all(
    files.map(async ({ file, category }) => {
      // Read file content
      const content = await fs.readFile(file, "utf-8");

      // Get file modified time
      const stat = await fs.stat(file);
      const createdAt = new Date(stat.birthtimeMs).toISOString();
      const updatedAt = new Date(stat.mtimeMs).toISOString();

      // Parse CSV
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        from: 2, // Skip header
      });

      return records.map((record: CSVAnyPlace) => {
        const { latitude, longitude, ...rest } = record;

        return {
          id: randomUUID(),
          category,
          ...rest,
          position: [Number(longitude), Number(latitude)],
          createdAt,
          updatedAt,
        };
      });
    }),
  );

  return results.flat();
};
