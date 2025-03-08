import config from "./config.json";
import { getAWSAccessKeyId, getAWSRegion, getAWSSecretAccessKey, getLocalDynamoEndpoint } from "@/lib/env";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

/**
 * DynamoDB client wrapper.
 */
export class Dynamo {
  /**
   * Bare-bones document client.
   * @public
   */
  public readonly client: DynamoDBDocumentClient;
  /**
   * Database configurations.
   */
  public readonly config = config;
  /**
   * Bare-bones DynamoDB Client.
   * @private
   */
  private readonly dynamoClient: DynamoDBClient;

  constructor(local: boolean = false) {
    local = local ?? process.env.NODE_ENV !== "production";

    this.dynamoClient = new DynamoDBClient({
      region: getAWSRegion(local),
      ...(local
        ? {
            endpoint: getLocalDynamoEndpoint(),
          }
        : {}),
      credentials: {
        accessKeyId: getAWSAccessKeyId(local),
        secretAccessKey: getAWSSecretAccessKey(local),
      },
    });

    const marshallOptions = {
      // Whether to automatically convert empty strings, blobs, and sets to `null`.
      convertEmptyValues: false,
      // Whether to remove undefined values while marshalling.
      removeUndefinedValues: true,
      // Whether to convert typeof object to map attribute.
      convertClassInstanceToMap: true,
    };

    const unmarshallOptions = {
      // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
      wrapNumbers: false,
    };

    const translateConfig = { marshallOptions, unmarshallOptions };
    this.client = DynamoDBDocumentClient.from(this.dynamoClient, translateConfig);
  }

  destroy() {
    this.client.destroy();
    this.dynamoClient.destroy();
  }

  scanTable = async (tableName: string) => {
    return this.client.send(new ScanCommand({ TableName: tableName }));
  };
}
