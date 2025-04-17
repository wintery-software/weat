import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

export const getSecret = async (secretName: string) => {
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
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
