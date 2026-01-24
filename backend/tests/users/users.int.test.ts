import { beforeAll, afterEach, describe, it, expect } from "vitest";
import request from "supertest";
import { setupTestDB } from "../setup/vitest.setup";
import { truncateAll } from "../helpers/db";

let app: any;
let pool: any;

afterEach(async () => {
  await truncateAll();
});

beforeAll(async () => {
  await setupTestDB();

  console.log("--- TEST CONNECTING TO:", process.env.DATABASE_URL);
  const dbModule = await import("../../src/db");
  pool = dbModule.pool;

  const serverModule = await import("../../src/server");
  app = serverModule.app;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
  	id UUID PRIMARY KEY,
		username TEXT UNIQUE NOT NULL,
		email TEXT UNIQUE NOT NULL,
  	password TEXT,
  	first_name TEXT,
		last_name TEXT,
		avatar_url TEXT,
  	description TEXT,
		birthday DATE,
		phone TEXT,
		role TEXT DEFAULT 'user',
  	is_active BOOLEAN DEFAULT TRUE,
  	email_confirmed BOOLEAN DEFAULT FALSE,
  	last_login_at TIMESTAMP WITH TIME ZONE,
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
  `);
});

describe("Users API (integration)", () => {
  it("creates user", async () => {
    const res = await request(app).post("/api/users").send({
      email: "test1@test.com",
      username: "testuser1",
      password: "hashedpassword",
      firstName: "Test",
      lastName: "User",
      avatarUrl: "https://example.com/avatar.jpg",
      description: "Seed user",
      birthday: "2000-01-01",
      phoneNumber: "1234567890",
    });

    expect(res.status).toBe(201);
  });
});
