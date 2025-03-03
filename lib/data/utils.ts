"use server";

import { parse } from "csv-parse/sync";
import fs from "fs/promises";
import { randomUUID } from "node:crypto";
import path from "path";

export const readPlaces = async () => {
  const dir = path.join(process.cwd(), "lib", "data");
  const files: {
    file: string;
    category: string;
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
      file: path.join(dir, "places_metadata - trails.csv"),
      category: "trail",
    },
  ];

  const results = await Promise.all(
    files.map(async ({ file, category }) => {
      // Read file content
      const content = await fs.readFile(file, "utf-8");

      // Get file modified time
      const stat = await fs.stat(file);
      const createdAt = stat.birthtimeMs;
      const updatedAt = stat.mtimeMs;

      // Parse CSV
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        from: 2,
      });

      return records.map((record: Restaurant) => ({
        id: randomUUID(),
        name: record.name || "",
        name_translation: record.name_translation || "",
        address: record.address || "",
        google_maps_url: record.google_maps_url || "",
        latitude: Number(record.latitude) || 0,
        longitude: Number(record.longitude) || 0,
        category,
        createdAt,
        updatedAt,
      }));
    }),
  );

  return results.flat();
};
