import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// End-to-end check (real multer + real controller + real disk I/O) for the
// fix described in the audit as "Validation de fichier toujours basée
// uniquement sur des métadonnées contrôlées par le client": a request whose
// declared mimetype AND filename extension both claim "application/pdf" /
// ".pdf" (i.e. passes the existing fileFilter in src/middlewares/upload.js)
// must still be rejected post-upload once the real bytes on disk are
// sniffed and turn out not to be a PDF at all.
const authDbMock = { getTokenVersion: vi.fn() };
vi.mock("../models/auth.model.js", () => ({
  AuthModel: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    touchLastLogin: vi.fn(),
    getTokenVersion: (...a) => authDbMock.getTokenVersion(...a),
  },
}));

vi.mock("../config/db.js", () => ({
  query: vi.fn().mockResolvedValue({ rows: [] }),
  pool: { on: vi.fn() },
}));

const { default: app } = await import("../app.js");
const { env } = await import("../config/env.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const documentsDir = path.join(__dirname, "../../uploads/documents");

const ADMIN = { id: 1, email: "admin@example.com", role: "admin_editeur", full_name: "Admin", token_version: 2 };

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name, token_version: user.token_version },
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

let writtenFilesBefore;

beforeEach(() => {
  vi.clearAllMocks();
  authDbMock.getTokenVersion.mockResolvedValue(ADMIN.token_version);
  writtenFilesBefore = new Set(fs.existsSync(documentsDir) ? fs.readdirSync(documentsDir) : []);
});

afterEach(() => {
  // Clean up whatever this test run wrote to the real uploads/documents dir
  // (valid uploads aren't auto-deleted; invalid ones are deleted by the
  // controller itself as part of the fix).
  if (!fs.existsSync(documentsDir)) return;
  for (const name of fs.readdirSync(documentsDir)) {
    if (!writtenFilesBefore.has(name)) {
      fs.rmSync(path.join(documentsDir, name), { force: true });
    }
  }
});

describe("POST /api/admin/uploads/document — post-upload content sniffing", () => {
  it("rejects a spoofed upload whose declared mimetype/extension both say PDF but whose actual bytes are an HTML/script payload", async () => {
    const token = signToken(ADMIN);
    const htmlPayload = Buffer.from("<html><body><script>alert(document.cookie)</script></body></html>");

    const res = await request(app)
      .post("/api/admin/uploads/document")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", htmlPayload, { filename: "cv.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(400);
  });

  it("accepts a genuine PDF whose bytes match its declared mimetype/extension", async () => {
    const token = signToken(ADMIN);
    const genuinePdf = Buffer.from("%PDF-1.4\n%fixture for vitest\n");

    const res = await request(app)
      .post("/api/admin/uploads/document")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", genuinePdf, { filename: "cv.pdf", contentType: "application/pdf" });

    expect(res.status).toBe(200);
    expect(res.body.data.path).toMatch(/^\/uploads\/documents\//);
  });
});
