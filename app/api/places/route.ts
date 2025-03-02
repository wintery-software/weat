import { parse } from "csv-parse/sync";
import * as fs from "fs";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import * as path from "path";

const readPlaces = () => {
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
  ];

  return files.flatMap(({ file, category }) => {
    const fileContent = fs.readFileSync(file, "utf-8");

    const records = parse(fileContent, {
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
    }));
  });
};

const places = readPlaces();

export const GET = async () => NextResponse.json(places);
