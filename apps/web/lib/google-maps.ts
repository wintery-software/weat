import { PlacesClient } from "@googlemaps/places";
import { google } from "@googlemaps/places/build/protos/protos";

import ISearchTextResponse = google.maps.places.v1.ISearchTextResponse;

export class GoogleMaps {
  private placesClient: PlacesClient;
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.placesClient = new PlacesClient({});

    if (!apiKey) {
      throw new Error(`API key is ${apiKey}`);
    }

    this.apiKey = apiKey;
  }

  async searchPlace({ name, address, timeout = 10000 }: { name?: string; address?: string; timeout?: number }) {
    if (!name && !address) {
      return null;
    }

    const result = await this.placesClient.searchText(
      {
        textQuery: `${name}+${address}`,
      },
      {
        timeout,
        otherArgs: {
          headers: {
            "X-goog-api-key": this.apiKey,
            "X-Goog-FieldMask": "*",
          },
        },
      },
    );

    return result.filter(Boolean) as ISearchTextResponse[];
  }
}
