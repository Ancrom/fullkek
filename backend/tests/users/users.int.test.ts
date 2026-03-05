import request from "supertest";
import { setupTestDB } from "../setup/vitest.setup";
import { getPool, resetPool, truncateAll } from "../helpers/db";
import { getAuthCookie } from "../helpers/auth";
import * as argon2 from "argon2";

let app: any;
let container: any;

beforeAll(async () => {
  container = await setupTestDB();

  console.log("--- TEST CONNECTING TO:", process.env.DATABASE_URL);

  const serverModule = await import("../../src/server");
  app = serverModule.app;
});

beforeEach(async () => {
  const pool = getPool();
  const passwordHash = await argon2.hash("password");
  await pool.query(
    `
		INSERT INTO users (id, email, username, password, first_name, last_name, avatar_url, description, birthday, phone, role, is_active, email_confirmed, last_login_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
	`,
    [
      "b6252555-eb50-4665-b476-b4ba5e3eaad3",
      "test@test.com",
      "testuser",
      passwordHash,
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
afterAll(async () => {
  const serverModule = await import("../../src/server");
  if (serverModule.stop) {
    await serverModule.stop();
  }

  await resetPool();

  if (container) {
    await container.stop();
  }
});

describe("Users API (integration)", () => {
  const idExample: string = "b6252555-eb50-4665-b476-b4ba5e3eaad3";

  it("creates user", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Cookie", getAuthCookie())
      .send({
        email: "test1@test.com",
        username: "testuser1",
        password: "password",
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
      .set("Cookie", getAuthCookie())
      .query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
  });

  it("returns user", async () => {
    const res = await request(app)
      .get(`/api/users/${idExample}`)
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
  });

  it("updates user", async () => {
    const res = await request(app)
      .put(`/api/users/${idExample}`)
      .set("Cookie", getAuthCookie())
      .send({
        email: "test1@test.com",
        username: "testuser1",
        password: "password",
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
    const res = await request(app)
      .delete(`/api/users/${idExample}`)
      .set("Cookie", getAuthCookie());

    expect(res.status).toBe(200);
  });

  it("logins user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "password",
    });
    expect(res.status).toBe(200);
  });
});
