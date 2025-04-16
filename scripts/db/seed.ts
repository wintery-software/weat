#!/usr/bin/env tsx
import { getSecret } from "@/lib/aws";
import { getEnvVar, loadEnv } from "@/lib/env";
import ora from "ora";
import { Pool } from "pg";

interface DbSecret {
  username: string;
  password: string;
  engine: string;
  host: string;
  port: number;
  dbInstanceIdentifier: string;
}

loadEnv();

const LOCAL_DB_URI = getEnvVar("LOCAL_DB_URI");

const main = async () => {
  const spinnerSecret = ora(`Retrieving production database secret`).start();
  const PROD_DB_SECRET_NAME = getEnvVar("PROD_DB_SECRET_NAME");
  const secret = (await getSecret(PROD_DB_SECRET_NAME)) as DbSecret;
  spinnerSecret.succeed("Retrieved secret");

  const prodConfig = {
    user: secret.username,
    password: secret.password,
    host: secret.host,
    port: secret.port,
    database: secret.dbInstanceIdentifier,
    ssl: {
      rejectUnauthorized: false, // Required for RDS/Aurora PostgreSQL
    },
  };
  const localConfig = {
    connectionString: LOCAL_DB_URI,
  };

  const spinnerPool = ora(`Creating database pools`).start();
  const prodClient = new Pool(prodConfig);
  const localClient = new Pool(localConfig);
  spinnerPool.succeed("Created database pools");

  // Get all table names from production database
  const spinnerTables = ora(`Fetching production table names`).start();
  const { rows: tables } = await prodClient.query(
    `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
    `,
  );
  spinnerTables.succeed(`Found ${tables.length} tables in production`);

  // Clone each table from prod to local
  for (const { table_name } of tables) {
    const spinnerTable = ora(`Cloning table ${table_name}`).start();

    try {
      // Get all data from production table
      const { rows } = await prodClient.query(`SELECT * FROM ${table_name}`);

      if (rows.length > 0) {
        try {
          // Truncate existing table and copy data from production
          await localClient.query(`TRUNCATE TABLE ${table_name}`);

          // Insert all data from production
          const columns = Object.keys(rows[0]).join(", ");
          const values = rows
            .map(
              (row) =>
                `(${Object.values(row)
                  .map((val) => {
                    if (val === null || val === undefined) {
                      return "NULL";
                    }
                    if (val instanceof Date) {
                      return `'${val.toISOString()}'`;
                    }
                    return `'${val.toString().replace(/'/g, "''")}'`;
                  })
                  .join(", ")})`,
            )
            .join(", ");

          await localClient.query(`
              INSERT INTO ${table_name} (${columns})
              VALUES
              ${values}
          `);

          spinnerTable.succeed(`Cloned ${table_name} (${rows.length} rows)`);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Unknown error";
          spinnerTable.fail(`Failed to clone ${table_name}: ${message}`);
          throw error;
        }
      } else {
        spinnerTable.succeed(`Cloned ${table_name} (0 rows)`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      spinnerTable.fail(`Failed to clone ${table_name}: ${message}`);
    }
  }

  await prodClient.end();
  await localClient.end();
};

main();
