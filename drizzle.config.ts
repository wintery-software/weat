import type { Config } from "drizzle-kit";
import { readFileSync } from "fs";
import { env } from "./lib/utils";

const url = env("DATABASE_URL");
console.error("URL:", url);

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
    ssl: {
      ca: readFileSync(env("DATABASE_CA_CERT_PATH")).toString(),
    },
  },
  verbose: true,
  strict: true,
} satisfies Config;
