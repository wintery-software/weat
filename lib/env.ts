import dotenv from "dotenv";
import path from "path";

export const loadEnv = () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Use of env files in production is not allowed.");
  }

  dotenv.config({
    path: [path.resolve(process.cwd(), ".env"), path.resolve(process.cwd(), ".env.local")],
  });
};

const loadKey = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not set.`);
  }

  return value as string;
};

export const getGoogleMapsAPIKey = () => loadKey("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");

export const getAWSRegion = (dummy: boolean = false) => (dummy ? "region" : loadKey("AWS_REGION"));
export const getAWSAccessKeyId = (dummy: boolean = false) => (dummy ? "accessKeyId" : loadKey("AWS_ACCESS_KEY_ID"));
export const getAWSSecretAccessKey = (dummy: boolean = false) =>
  dummy ? "secretAccessKey" : loadKey("AWS_SECRET_ACCESS_KEY");
