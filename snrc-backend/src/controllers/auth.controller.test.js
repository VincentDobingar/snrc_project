import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const dbMock = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
  touchLastLogin: vi.fn(),
  getTokenVersion: vi.fn(),
};

vi.mock("../models/auth.model.js", () => ({
  AuthModel: {
    findByEmail: (...a) => dbMock.findByEmail(...a),
    findById: (...a) => dbMock.findById(...a),
    touchLastLogin: (...a) => dbMock.touchLastLogin(...a),
    getTokenVersion: (...a) => dbMock.getTokenVersion(...a),
  },
}));

// Also mock the raw db query export in case anything else in the require
// chain touches it (defensive; no real Postgres connection is available here).
vi.mock("../config/db.js", () => ({
  query: vi.fn().mockResolvedValue({ rows: [] }),
  pool: { on: vi.fn() },
}));

const { default: app } = await import("../app.js");
const { env } = await import("../config/env.js");

const PASSWORD = "CorrectHorseBatteryStaple1!";

function makeUser(overrides = {}) {
  return {
    id: 1,
    full_name: "Admin Test",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    token_version: 3,
    ...overrides,
  };
}

async function withPasswordHash(user) {
  return { ...user, password_hash: await bcrypt.hash(PASSWORD, 4) };
}

function signValidToken(user, { tokenVersion = user.token_version } = {}) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      token_version: tokenVersion,
    },
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/login", () => {
  it("returns 200, sets a cookie, and omits password_hash for valid credentials + active user", async () => {
    const user = await withPasswordHash(makeUser());
    dbMock.findByEmail.mockResolvedValue(user);
    dbMock.touchLastLogin.mockResolvedValue();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: PASSWORD });

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    const cookieHeader = res.headers["set-cookie"].join(";");
    expect(cookieHeader).toContain(env.COOKIE_NAME);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.password_hash).toBeUndefined();
    expect(res.body.data.user.email).toBe(user.email);
  });

  it("returns 401 for a wrong password", async () => {
    const user = await withPasswordHash(makeUser());
    dbMock.findByEmail.mockResolvedValue(user);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  it("returns 403 when the account status is not active", async () => {
    const user = await withPasswordHash(makeUser({ status: "inactive" }));
    dbMock.findByEmail.mockResolvedValue(user);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: PASSWORD });

    expect(res.status).toBe(403);
  });
});

describe("requireAuth token_version revocation (GET /api/auth/me)", () => {
  it("rejects with 401 when the token's token_version does not match the current DB value", async () => {
    const user = makeUser({ token_version: 5 });
    const token = signValidToken(user, { tokenVersion: 2 }); // stale token
    dbMock.getTokenVersion.mockResolvedValue(5); // current version in DB has moved on

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `${env.COOKIE_NAME}=${token}`);

    expect(res.status).toBe(401);
  });

  it("succeeds (reaches the controller) when token_version matches", async () => {
    const user = makeUser({ token_version: 5 });
    const token = signValidToken(user, { tokenVersion: 5 });
    dbMock.getTokenVersion.mockResolvedValue(5);
    dbMock.findById.mockResolvedValue(user);

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `${env.COOKIE_NAME}=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(user.email);
  });

  it("returns 401 when no token is provided at all", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns 401 for a malformed/garbage token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `${env.COOKIE_NAME}=not-a-real-jwt`);
    expect(res.status).toBe(401);
  });
});

// Note: refresh is authenticated via Authorization: Bearer here (not a cookie)
// so these requests aren't also subject to the separate CSRF double-submit
// check in src/utils/csrf.js (which only applies to cookie-authenticated
// mutating requests) — that middleware has its own dedicated test coverage.
describe("POST /api/auth/refresh", () => {
  it("returns 403 when the account status is not active (regression: originally-critical finding)", async () => {
    const user = makeUser({ status: "inactive", token_version: 1 });
    const token = signValidToken(user, { tokenVersion: 1 });
    dbMock.getTokenVersion.mockResolvedValue(1);
    dbMock.findById.mockResolvedValue(user);

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it("returns 401 when token_version does not match", async () => {
    const user = makeUser({ token_version: 9 });
    const token = signValidToken(user, { tokenVersion: 1 });
    dbMock.getTokenVersion.mockResolvedValue(9);

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
  });

  it("succeeds and issues a new token when everything is valid", async () => {
    const user = makeUser({ token_version: 4 });
    const token = signValidToken(user, { tokenVersion: 4 });
    dbMock.getTokenVersion.mockResolvedValue(4);
    dbMock.findById.mockResolvedValue(user);

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
