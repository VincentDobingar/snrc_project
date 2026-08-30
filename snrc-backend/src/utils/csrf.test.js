import { describe, it, expect } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import { csrfProtection, CSRF_COOKIE_NAME } from "./csrf.js";
import { env } from "../config/env.js";

function buildApp() {
  const app = express();
  app.use(cookieParser());
  app.use(csrfProtection);
  app.get("/thing", (_req, res) => res.status(200).json({ ok: true }));
  app.post("/thing", (_req, res) => res.status(200).json({ ok: true }));
  return app;
}

describe("csrfProtection", () => {
  it("rejects a cookie-authenticated POST with a missing X-CSRF-Token header", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/thing")
      .set("Cookie", [`${env.COOKIE_NAME}=some-jwt`, `${CSRF_COOKIE_NAME}=abc123`]);
    // header intentionally omitted
    expect(res.status).toBe(403);
  });

  it("rejects a cookie-authenticated POST with a mismatched X-CSRF-Token header", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/thing")
      .set("Cookie", [`${env.COOKIE_NAME}=some-jwt`, `${CSRF_COOKIE_NAME}=abc123`])
      .set("X-CSRF-Token", "does-not-match");
    expect(res.status).toBe(403);
  });

  it("allows a cookie-authenticated POST when the header matches the cookie", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/thing")
      .set("Cookie", [`${env.COOKIE_NAME}=some-jwt`, `${CSRF_COOKIE_NAME}=abc123`])
      .set("X-CSRF-Token", "abc123");
    expect(res.status).toBe(200);
  });

  it("allows a GET request through without a CSRF token even with cookie auth present", async () => {
    const app = buildApp();
    const res = await request(app)
      .get("/thing")
      .set("Cookie", [`${env.COOKIE_NAME}=some-jwt`, `${CSRF_COOKIE_NAME}=abc123`]);
    expect(res.status).toBe(200);
  });

  it("allows a POST authenticated via Authorization: Bearer (not cookie) without a CSRF token", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/thing")
      .set("Authorization", "Bearer some-jwt");
    expect(res.status).toBe(200);
  });
});
