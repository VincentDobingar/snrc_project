import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

// Covers the fix for "La FAQ échappe à la sanitisation HTML serveur": the
// admin create/update routes must run sanitizeHtmlFields("answer") before
// the request reaches the model layer, just like pages/news/services/jobs
// already do for their rich-text fields.
const queryMock = vi.fn();
vi.mock("../config/db.js", () => ({
  query: (...a) => queryMock(...a),
  pool: { on: vi.fn() },
}));

const authDbMock = { getTokenVersion: vi.fn() };
vi.mock("../models/auth.model.js", () => ({
  AuthModel: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    touchLastLogin: vi.fn(),
    getTokenVersion: (...a) => authDbMock.getTokenVersion(...a),
  },
}));

const { default: app } = await import("../app.js");
const { env } = await import("../config/env.js");

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name, token_version: user.token_version },
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

const ADMIN = { id: 1, email: "admin@example.com", role: "admin_editeur", full_name: "Admin", token_version: 1 };

beforeEach(() => {
  vi.clearAllMocks();
  authDbMock.getTokenVersion.mockResolvedValue(ADMIN.token_version);
  queryMock.mockResolvedValue({ rows: [{ id: 1, question: "q", answer: "a", display_order: 0, status: "active" }] });
});

describe("POST /api/admin/faqs — server-side HTML sanitization", () => {
  it("strips a <script> tag from the answer field before it reaches the database layer", async () => {
    const token = signToken(ADMIN);

    const res = await request(app)
      .post("/api/admin/faqs")
      .set("Authorization", `Bearer ${token}`) // Bearer auth sidesteps the separate CSRF check
      .send({ question: "Une question ?", answer: "<p>Réponse</p><script>alert(1)</script>" });

    expect(res.status).toBe(201);

    const insertCall = queryMock.mock.calls.find(([sql]) => sql.includes("INSERT INTO faqs"));
    expect(insertCall).toBeDefined();
    const [, params] = insertCall;
    const sanitizedAnswer = params[1];
    expect(sanitizedAnswer).not.toContain("<script>");
    expect(sanitizedAnswer).toContain("<p>Réponse</p>");
  });
});

describe("PUT /api/admin/faqs/:id — server-side HTML sanitization", () => {
  it("strips a <script> tag from the answer field before it reaches the database layer", async () => {
    queryMock.mockImplementation(async (sql) => {
      if (sql.includes("SELECT * FROM faqs WHERE id=")) {
        return { rows: [{ id: 9, question: "q", answer: "old", display_order: 0, status: "active" }] };
      }
      return { rows: [{ id: 9, question: "q", answer: "new", display_order: 0, status: "active" }] };
    });
    const token = signToken(ADMIN);

    const res = await request(app)
      .put("/api/admin/faqs/9")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "Une question ?", answer: "<img src=x onerror=alert(1)>" });

    expect(res.status).toBe(200);

    const updateCall = queryMock.mock.calls.find(([sql]) => sql.includes("UPDATE faqs SET"));
    expect(updateCall).toBeDefined();
    const [, params] = updateCall;
    const sanitizedAnswer = params[1];
    expect(sanitizedAnswer).not.toContain("onerror");
  });
});
