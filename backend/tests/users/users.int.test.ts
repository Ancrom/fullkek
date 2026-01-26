import { beforeAll, afterEach, beforeEach, describe, it, expect } from "vitest";
import request from "supertest";
import { setupTestDB } from "../setup/vitest.setup";
import { truncateAll } from "../helpers/db";

let app: any;
let pool: any;

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

beforeEach(async () => {
  await pool.query(
    `
		INSERT INTO users (id, email, username, password, first_name, last_name, avatar_url, description, birthday, phone, role, is_active, email_confirmed, last_login_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
	`,
    [
      "b6252555-eb50-4665-b476-b4ba5e3eaad3",
      "test@test.com",
      "testuser",
      "hashedpassword",
      "testfirstname",
      "testlastname",
      "https://example.com/avatar.jpg",
      "Seed user",
      "2022-01-01T00:00:00.000Z",
      "1234567890",
      "user",
      true,
      false,
      null,
      "2022-01-01T00:00:00.000Z",
      "2022-01-01T00:00:00.000Z",
    ],
  );
});

afterEach(async () => {
  await truncateAll();
});

describe("Users API (integration)", () => {
  const idExample: string = "b6252555-eb50-4665-b476-b4ba5e3eaad3";

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

  it("returns page of users", async () => {
    const res = await request(app)
      .get("/api/users")
      .query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
  });

  it("returns user", async () => {
    const res = await request(app).get(`/api/users/${idExample}`);

    expect(res.status).toBe(200);
  });

	it("updates user", async () => {
		const res = await request(app)
			.put(`/api/users/${idExample}`)
			.send({
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

		expect(res.status).toBe(200);
	});

	it("deletes user", async () => {
		const res = await request(app).delete(`/api/users/${idExample}`);

		expect(res.status).toBe(200);
	});
});
