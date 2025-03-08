import { Dynamo } from "@/db/dynamo";
import { loadEnv } from "@/lib/env";
import { CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { google } from "@googlemaps/places/build/protos/protos";
import chalk from "chalk";
import { promises as fs } from "fs";
import { randomUUID } from "node:crypto";
import path from "path";

import IPlace = google.maps.places.v1.IPlace;

loadEnv();

const error = chalk.bold.red;

const dynamo = new Dynamo(true);

const toString = (place: IPlace) =>
  `Place<id="${place.id}", name="${place.displayName?.text}", address="${place.formattedAddress}", googleMapsUri="${place.googleMapsUri}">`;

const readData = async () => {
  const filePath = path.resolve(path.join(__dirname, "place-data.json"));

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as IPlace[];
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createDynamoTables = async () => {
  const tableConfigs = Object.values(dynamo.config.tables);

  for (let i = 0; i < tableConfigs.length; i++) {
    const config = tableConfigs[i];

    try {
      // Delete the table first
      await dynamo.client.send(new DeleteTableCommand({ TableName: config.tableName }));
      // Create the table
      await dynamo.client.send(
        new CreateTableCommand({
          TableName: config.tableName,
          KeySchema: [
            {
              AttributeName: config.partitionKey,
              KeyType: "HASH",
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: config.partitionKey,
              AttributeType: "S",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
        }),
      );

      console.log(`[${i + 1}/${tableConfigs.length}] ${config.tableName}`);
    } catch (e) {
      console.error(error(`[${i + 1}/${tableConfigs.length}] Failed: ${config.tableName}: ${e}`));
    }
  }
};

const writeDataToDynamo = async (data: IPlace[]) => {
  const tableName = dynamo.config.tables.places.tableName;

  for (let i = 0; i < data.length; i++) {
    const place = data[i];
    const placeTypes = place.types;

    let type: Weat.PlaceType = "other";

    if (placeTypes) {
      if (placeTypes.includes("restaurant")) {
        type = "restaurant";
      } else if (placeTypes.includes("tea_house")) {
        type = "drink";
      } else if (placeTypes.includes("park")) {
        type = "park";
      }
    }

    const types = new Set([type]);
    if (types.size === 0) {
      throw new Error(`No type found for place ${toString(place)}`);
    }
    const now = new Date();

    try {
      await dynamo.client.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            Id: randomUUID(),
            PlaceId: place.id,
            Name: {
              Text: place.displayName?.text,
              LanguageCode: place.displayName?.languageCode,
            },
            Types: types,
            Address: place.formattedAddress,
            GoogleMapsUrl: place.googleMapsUri,
            Location: {
              Lat: place.location!.latitude!,
              Lng: place.location!.longitude!,
            },
            PhoneNumber: place.nationalPhoneNumber?.replace(/\D/g, "") || null,
            WebsiteUrl: place.websiteUri || null,
            CreatedAt: now.toISOString(),
            UpdatedAt: now.toISOString(),
          } as Weat.Dynamo.Place,
        }),
      );
      console.log(`[${i + 1}/${data.length}]`, toString(place));
    } catch (e) {
      console.error(error(`[${i + 1}/${data.length}] ${toString(place)}: ${e}`));
    }
  }
};

const main = async () => {
  console.log("Reading places data...");
  const readDataPromise = readData();

  console.log("Creating DynamoDB tables...");
  await createDynamoTables();

  const data = await readDataPromise;

  console.log("Writing data to DynamoDB...");
  await writeDataToDynamo(data);
};

main().then(() => {
  dynamo.destroy();
});
