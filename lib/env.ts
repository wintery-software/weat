import dotenv from "dotenv";
import path from "path";

export const loadEnv = () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Use of env files in production is not allowed.");
  }

  dotenv.config({
    path: [path.resolve(__dirname, "..", ".env"), path.resolve(__dirname, "..", ".env.local")],
  });
};

export const getEnvVar = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not set.`);
  }

  return value as string;
};

export const getGoogleMapsAPIKey = () => getEnvVar("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");

export const getAWSRegion = () => getEnvVar("AWS_REGION");
export const getAWSAccessKeyId = () => getEnvVar("AWS_ACCESS_KEY_ID");
export const getAWSSecretAccessKey = () => getEnvVar("AWS_SECRET_ACCESS_KEY");
