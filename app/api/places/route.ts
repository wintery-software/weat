import { Dynamo } from "@/db/dynamo";
import { NextResponse } from "next/server";

export const GET = async () => {
  const client = new Dynamo();
  const output = await client.scanTable(client.config.tables.places.tableName);
  client.destroy();

  const places = output.Items?.map((item) => {
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
      location: {
        lat: item.Location.Lat,
        lng: item.Location.Lng,
      },
      phoneNumber: item.PhoneNumber,
      websiteUrl: item.WebsiteUrl,
      createdAt: item.CreatedAt,
      updatedAt: item.UpdatedAt,
    };
  }) as Weat.Place[];

  return NextResponse.json(places);
};
