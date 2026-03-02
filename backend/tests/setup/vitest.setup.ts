import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Client } from "pg";
import * as argon2 from "argon2";
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

  const passwordHash = await argon2.hash("password");
  await client.query(
    `
  INSERT INTO users (
    id, email, username, password, first_name, last_name, role, is_active
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  `,
    [
      "b6252555-eb50-4665-b476-b4ba5e3eaad3",
      "test@test.com",
      "testuser",
      passwordHash,
      "Test",
      "User",
      "user",
      true,
    ],
  );

  for (const stmt of sql.split(/;\s*$/m)) {
    if (stmt.trim()) {
      await client.query(stmt);
    }
  }

  await client.end();

  return container;
}
