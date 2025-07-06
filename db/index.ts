import { env } from "@/lib/utils";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// eslint-disable-next-line import/no-namespace
import * as schema from "./schema";

// Create the connection
const url = env("DATABASE_URL");

// Create the postgres client
const client = postgres(url, { prepare: false });

// Create the database instance
export const db = drizzle(client, { schema });
