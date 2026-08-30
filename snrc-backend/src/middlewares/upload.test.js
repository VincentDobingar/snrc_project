import { describe, it, expect } from "vitest";
import {
  buildFileFilter,
  sanitizeFilename,
  IMAGE_MIME_TYPES,
  IMAGE_EXTENSIONS,
  DOCUMENT_MIME_TYPES,
  DOCUMENT_EXTENSIONS,
} from "./upload.js";

function runFilter(filter, file) {
  return new Promise((resolve) => {
    filter({}, file, (err, accepted) => resolve({ err, accepted }));
  });
}

describe("buildFileFilter - document filter", () => {
  const documentFilter = buildFileFilter(DOCUMENT_MIME_TYPES, DOCUMENT_EXTENSIONS);

  it("accepts a genuine PDF (correct mimetype + extension)", async () => {
    const { err, accepted } = await runFilter(documentFilter, {
      mimetype: "application/pdf",
      originalname: "cv.pdf",
    });
    expect(err).toBeNull();
    expect(accepted).toBe(true);
  });

  it("rejects a spoofed upload: application/pdf mimetype with a .html extension (the fixed exploit)", async () => {
    const { err, accepted } = await runFilter(documentFilter, {
      mimetype: "application/pdf",
      originalname: "cv.html",
    });
    expect(err).toBeInstanceOf(Error);
    expect(accepted).toBeUndefined();
  });

  it("rejects a mismatched mimetype/extension pair (image/png mimetype, .exe extension)", async () => {
    const { err, accepted } = await runFilter(documentFilter, {
      mimetype: "image/png",
      originalname: "malware.exe",
    });
    expect(err).toBeInstanceOf(Error);
    expect(accepted).toBeUndefined();
  });
});

describe("buildFileFilter - image filter", () => {
  const imageFilter = buildFileFilter(IMAGE_MIME_TYPES, IMAGE_EXTENSIONS);

  it("accepts a genuine PNG", async () => {
    const { err, accepted } = await runFilter(imageFilter, {
      mimetype: "image/png",
      originalname: "photo.png",
    });
    expect(err).toBeNull();
    expect(accepted).toBe(true);
  });

  it("rejects image/svg+xml (SVG-XSS vector)", async () => {
    const { err, accepted } = await runFilter(imageFilter, {
      mimetype: "image/svg+xml",
      originalname: "logo.svg",
    });
    expect(err).toBeInstanceOf(Error);
    expect(accepted).toBeUndefined();
  });

  it("rejects a mismatched mimetype/extension pair (image/png mimetype, .exe extension)", async () => {
    const { err, accepted } = await runFilter(imageFilter, {
      mimetype: "image/png",
      originalname: "payload.exe",
    });
    expect(err).toBeInstanceOf(Error);
    expect(accepted).toBeUndefined();
  });
});

describe("sanitizeFilename", () => {
  it("strips path traversal segments from a malicious originalname", () => {
    const result = sanitizeFilename("../../etc/passwd");
    expect(result).not.toMatch(/\.\./);
    expect(result).not.toMatch(/\//);
  });

  it("strips unsafe characters like <script> tags and preserves a safe extension", () => {
    const result = sanitizeFilename("<script>.png");
    expect(result).not.toMatch(/[<>]/);
    expect(result.endsWith(".png")).toBe(true);
  });

  it("preserves the extension and prefixes with a timestamp for a normal filename", () => {
    const result = sanitizeFilename("Mon CV Final.pdf");
    expect(result.endsWith(".pdf")).toBe(true);
    expect(result).toMatch(/^\d+-/);
  });
});
