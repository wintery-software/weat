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
  const dir = path.join(process.cwd(), "db/data");
  const files: {
    file: string;
    type: Weat.PlaceType;
  }[] = [
    {
      file: path.join(dir, "places_metadata - restaurants.csv"),
      type: "restaurant" as Weat.PlaceType,
    },
    {
      file: path.join(dir, "places_metadata - drinks & snacks.csv"),
      type: "drink" as Weat.PlaceType,
    },
    {
      file: path.join(dir, "places_metadata - parks.csv"),
      type: "park" as Weat.PlaceType,
    },
  ];

  const results: Weat.Place[] = await Promise.all(
    files.map(async ({ file, type }) => {
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
        return {
          id: randomUUID(),
          placeId: "",
          names: [
            {
              text: record.name,
              languageCode: "en",
            },
            ...(record.name_translation
              ? [
                  {
                    text: record.name_translation,
                    languageCode: "zh",
                  },
                ]
              : []),
          ],
          types: Array.from(new Set([type])),
          address: record.address,
          googleMapsUrl: record.google_maps_url,
          position: {
            lat: Number(record.latitude),
            lng: Number(record.longitude),
          },
          phoneNumber: "",
          websiteUrl: "",
          createdAt,
          updatedAt,
        } as Weat.Place;
      });
    }),
  );

  return results.flat();
};
