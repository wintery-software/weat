import { env } from "@/lib/utils";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// eslint-disable-next-line import/no-namespace
import * as schema from "./schema";

// Create the connection
const url = env("DATABASE_URL");
const isLocal = url.includes("localhost") || url.includes("127.0.0.1");

let client: postgres.Sql;

if (isLocal) {
  // Local development - no SSL
  client = postgres(url, { prepare: false });
} else {
  // Production - with SSL (no CA needed for Supabase)
  // Vercel is IPv4-only. Disable prefetch as it is not supported for "Transaction" pool mode
  client = postgres(url, { prepare: false, ssl: true });
}

// Create the database instance
export const db = drizzle(client, { schema });
