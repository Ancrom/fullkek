import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../../src/server";
import jwt from "jsonwebtoken";

describe("Auth middleware", () => {
  const secret = process.env.JWT_SECRET

  it("should return 401 if cookie is missing", async () => {
    const response = await request(app).get("/api/users?page=1&limit=10");
    expect(response.status).toBe(401);
    expect(response.body.code).toBe("UNAUTHORIZED_ERROR");
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should return 401 if cookie is invalid", async () => {
    const response = await request(app)
      .get("/api/users?page=1&limit=10")
      .set("Cookie", ["access_token=invalid_token"]);
		expect(response.status).toBe(401);
  });

  it("should call next if cookie is valid", async () => {
    const token = jwt.sign({ id: "1" }, secret!);
    const response = await request(app)
      .get("/api/users/protected")
      .set("Cookie", [`access_token=${token}`]);
    expect(response.status).toBe(200);
  });
});
