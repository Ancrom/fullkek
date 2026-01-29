import { PostgreSqlContainer } from "@testcontainers/postgresql";

export async function setupTestDB() {
  let container = await new PostgreSqlContainer("postgres:16")
    .withDatabase("app_test")
    .withUsername("test")
    .withPassword("test")
    .start();

  process.env.DATABASE_URL = container.getConnectionUri();
  process.env.NODE_ENV = 'test';
}
