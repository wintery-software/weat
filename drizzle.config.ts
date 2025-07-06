import type { Config } from "drizzle-kit";
import { env } from "./lib/utils";

const url = env("DATABASE_URL");
console.error("URL:", url);

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
    ssl: true,
  },
  verbose: true,
  strict: true,
} satisfies Config;
