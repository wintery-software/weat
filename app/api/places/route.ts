import { readPlaces } from "@/db/data/utils";
import { Dynamo } from "@/db/dynamo";
import { DataSources } from "@/db/types";
import { NextResponse } from "next/server";

export const GET = async () => {
  const source = process.env.DATA_SOURCE as DataSources | undefined;

  if (!source) {
    return NextResponse.json({ error: "Data source error." }, { status: 500 });
  }

  let data: Weat.Place[];

  if (source === "csv") {
    const places = await readPlaces();
    data = places.map((place) => {
      return {
        id: place.id,
        placeId: place.placeId,
        name: {
          text: place.name.text,
          languageCode: place.name.languageCode,
        },
        types: place.types,
        address: place.address,
        googleMapsUrl: place.googleMapsUrl,
        position: {
          lat: place.position.lat,
          lng: place.position.lng,
        },
        phoneNumber: place.phoneNumber,
        websiteUrl: place.websiteUrl,
        createdAt: place.createdAt,
        updatedAt: place.updatedAt,
      };
    });
  } else {
    try {
      const client = new Dynamo(source === "dynamo-local");
      const output = await client.scanTable(client.config.tables.places.tableName);
      client.destroy();

      const items = (output.Items || []) as Weat.Dynamo.Place[];
      data = items.map((item) => {
        return {
          id: item.Id,
          placeId: item.PlaceId,
          name: {
            text: item.Name.Text,
            languageCode: item.Name.LanguageCode,
          },
          types: Array.from(item.Types),
          address: item.Address,
          googleMapsUrl: item.GoogleMapsUrl,
          position: {
            lat: item.Position.Lat,
            lng: item.Position.Lng,
          },
          phoneNumber: item.PhoneNumber,
          websiteUrl: item.WebsiteUrl,
          createdAt: item.CreatedAt,
          updatedAt: item.UpdatedAt,
        };
      });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json(data);
};
