import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Covers the fix for "CV et lettres de motivation téléchargeables
// publiquement sans authentification": /uploads/documents/:filename must now
// require an authenticated admin session, unlike /uploads/images and
// /uploads/videos which stay public.
const authDbMock = { getTokenVersion: vi.fn() };
vi.mock("../models/auth.model.js", () => ({
  AuthModel: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    touchLastLogin: vi.fn(),
    getTokenVersion: (...a) => authDbMock.getTokenVersion(...a),
  },
}));

const dbMock = { query: vi.fn().mockResolvedValue({ rows: [] }) };
vi.mock("../config/db.js", () => ({
  query: (...a) => dbMock.query(...a),
  pool: { on: vi.fn() },
}));

const { default: app } = await import("../app.js");
const { env } = await import("../config/env.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const documentsDir = path.join(__dirname, "../../uploads/documents");
const testFilename = "vitest-fixture-cv.pdf";
const testFilePath = path.join(documentsDir, testFilename);

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name, token_version: user.token_version },
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

beforeAll(() => {
  fs.mkdirSync(documentsDir, { recursive: true });
  fs.writeFileSync(testFilePath, "%PDF-1.4 fake fixture content for vitest\n");
});

afterAll(() => {
  fs.rmSync(testFilePath, { force: true });
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /uploads/documents/:filename", () => {
  it("rejects an unauthenticated request", async () => {
    const res = await request(app).get(`/uploads/documents/${testFilename}`);
    expect(res.status).toBe(401);
  });

  it("rejects a request with an invalid/garbage token", async () => {
    const res = await request(app).get(`/uploads/documents/${testFilename}`).set("Cookie", `${env.COOKIE_NAME}=not-a-real-jwt`);
    expect(res.status).toBe(401);
  });

  it("serves the file, with attachment disposition, to an authenticated admin session", async () => {
    const admin = { id: 1, email: "admin@example.com", role: "admin_editeur", full_name: "Admin", token_version: 3 };
    authDbMock.getTokenVersion.mockResolvedValue(admin.token_version);
    const token = signToken(admin);

    const res = await request(app).get(`/uploads/documents/${testFilename}`).set("Cookie", `${env.COOKIE_NAME}=${token}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-disposition"]).toMatch(/attachment/);
  });
});

describe("GET /uploads/documents/:filename — publication exemption", () => {
  it("serves a file publicly, without authentication, when it matches a published publication's file_url", async () => {
    dbMock.query.mockResolvedValueOnce({ rows: [{ x: 1 }] }); // existsByFileUrl -> true

    const res = await request(app).get(`/uploads/documents/${testFilename}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-disposition"]).toBeUndefined();
  });
});

describe("GET /uploads/images and /uploads/videos", () => {
  it("stay publicly reachable without authentication (404 for a missing file, not 401)", async () => {
    const res = await request(app).get("/uploads/images/does-not-exist.png");
    expect(res.status).toBe(404);
  });
});
