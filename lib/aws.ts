import { getAWSAccessKeyId, getAWSRegion, getAWSSecretAccessKey } from "./env";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

export const getSecret = async (secretName: string) => {
  const client = new SecretsManagerClient({
    region: getAWSRegion(),
    credentials: {
      accessKeyId: getAWSAccessKeyId(),
      secretAccessKey: getAWSSecretAccessKey(),
    },
  });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );

    if (!response.SecretString) {
      throw new Error(`Secret ${secretName} has no string value`);
    }

    return JSON.parse(response.SecretString);
  } catch (error) {
    throw new Error(`Failed to get secret ${secretName}: ${error instanceof Error ? error.message : String(error)}`);
  }
};
