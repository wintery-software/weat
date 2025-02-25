import { parse } from "csv-parse/sync";
import * as fs from "fs";
import { NextResponse } from "next/server";
import * as path from "path";

const readRestaurants = () => {
  const dirPath = path.join(process.cwd(), "test");
  const files = fs.readdirSync(dirPath);
  const csvFiles = files.filter((file) => file.endsWith(".csv"));

  return csvFiles.flatMap((file) => {
    const filePath = path.join(dirPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      from: 2,
    });

    return records.map((record: Restaurant, index: number) => ({
      id: `${file}-${index + 1}`,
      name: record.name || "",
      name_translation: record.name_translation || "",
      address: record.address || "",
      google_maps_url: record.google_maps_url || "",
      cuisine: record.cuisine || "",
      latitude: Number(record.latitude) || 0,
      longitude: Number(record.longitude) || 0,
    }));
  });
};

const restaurants = readRestaurants();

export const GET = async () => NextResponse.json(restaurants);
