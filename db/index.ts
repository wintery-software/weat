import { env } from "@/lib/utils";
import { drizzle } from "drizzle-orm/postgres-js";
import fs from "fs";
import postgres from "postgres";

// Create the connection
const url = env("DATABASE_URL");
const ca = fs.readFileSync(env("DATABASE_CA_CERT_PATH")).toString();

// Vercel is IPv4-only. Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(url, { prepare: false, ssl: { ca } });

// Create the database instance
export const db = drizzle(client);
