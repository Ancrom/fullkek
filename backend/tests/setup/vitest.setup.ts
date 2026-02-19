import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";

export async function setupTestDB() {
  let container = await new PostgreSqlContainer("postgres:16")
    .withDatabase("app_test")
    .withUsername("test")
    .withPassword("test")
    .start();

  process.env.DATABASE_URL = container.getConnectionUri();
  process.env.NODE_ENV = "test";

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  await client.connect();

  const initSqlPath = path.resolve(__dirname, "../../../infra/db/init.sql");
  const sql = fs.readFileSync(initSqlPath, "utf-8");

  for (const stmt of sql.split(/;\s*$/m)) {
    if (stmt.trim()) {
      await client.query(stmt);
    }
  }

  await client.end();

  return container;
}
