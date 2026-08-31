import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { isFileContentValid, verifyUploadedFilesContent } from "./verifyFileContent.js";
import { DOCUMENT_MIME_TYPES, IMAGE_MIME_TYPES } from "./upload.js";

// Real magic bytes for the formats involved, so file-type's content-sniffing
// has something genuine to detect (this is the whole point of the fix: the
// earlier fileFilter check only ever looked at attacker-controlled multipart
// metadata — declared mimetype + filename extension — never the real bytes).
const PDF_MAGIC = Buffer.from("%PDF-1.4\n%fixture for vitest\n");
// A real (if tiny, 1x1 transparent) PNG — file-type validates the chunk
// structure, not just the 8-byte signature, so a hand-rolled header alone
// isn't enough to be detected as `image/png`.
const PNG_MAGIC = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);
// OLE2 / "Compound File Binary" container header — shared by legacy .doc,
// .xls and .ppt.
const CFB_MAGIC = Buffer.concat([
  Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
  Buffer.alloc(120, 0),
]);
const HTML_PAYLOAD = Buffer.from("<html><body><script>alert(document.cookie)</script></body></html>");
// A minimal valid (empty) ZIP archive — `application/zip` is detected
// correctly by file-type but isn't itself in DOCUMENT_MIME_TYPES (only the
// specific OOXML docx/xlsx/pptx zip variants are), so it's a good stand-in
// for "real content that doesn't match any allowed document/image type".
// (Note: a plain image/png IS allowed as a document mimetype in this app —
// e.g. a scanned CV photo — so PNG bytes can't be used as a mismatch fixture
// here the way they are for the image-only allowlist above.)
const ZIP_MAGIC = Buffer.from([
  0x50, 0x4b, 0x05, 0x06, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "snrc-verify-file-content-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function writeFixture(filename, buffer) {
  const filePath = path.join(tmpDir, filename);
  fs.writeFileSync(filePath, buffer);
  return { path: filePath, originalname: filename };
}

describe("isFileContentValid", () => {
  it("accepts a genuine PDF whose bytes match its extension", async () => {
    const file = writeFixture("cv.pdf", PDF_MAGIC);
    await expect(isFileContentValid(file, DOCUMENT_MIME_TYPES)).resolves.toBe(true);
  });

  it("accepts a genuine PNG whose bytes match its extension", async () => {
    const file = writeFixture("photo.png", PNG_MAGIC);
    await expect(isFileContentValid(file, IMAGE_MIME_TYPES)).resolves.toBe(true);
  });

  it("rejects an HTML/script payload saved with a spoofed .pdf extension (the exploit this fix closes: fileFilter alone would have accepted it since the client also declares mimetype: application/pdf)", async () => {
    const file = writeFixture("cv.pdf", HTML_PAYLOAD);
    await expect(isFileContentValid(file, DOCUMENT_MIME_TYPES)).resolves.toBe(false);
  });

  it("rejects ZIP content saved with a spoofed .pdf extension", async () => {
    const file = writeFixture("cv.pdf", ZIP_MAGIC);
    await expect(isFileContentValid(file, DOCUMENT_MIME_TYPES)).resolves.toBe(false);
  });

  it("accepts a genuine legacy .doc file (OLE2/CFB container — Word, Excel and PowerPoint's old binary format all share this same signature, so file-type cannot tell them apart by content)", async () => {
    const file = writeFixture("lettre.doc", CFB_MAGIC);
    await expect(isFileContentValid(file, DOCUMENT_MIME_TYPES)).resolves.toBe(true);
  });

  it("accepts a genuine legacy .xls/.ppt file via the same CFB container", async () => {
    const xls = writeFixture("budget.xls", CFB_MAGIC);
    const ppt = writeFixture("slides.ppt", CFB_MAGIC);
    await expect(isFileContentValid(xls, DOCUMENT_MIME_TYPES)).resolves.toBe(true);
    await expect(isFileContentValid(ppt, DOCUMENT_MIME_TYPES)).resolves.toBe(true);
  });

  it("rejects content that isn't a CFB container but claims a legacy .doc extension", async () => {
    const file = writeFixture("fake.doc", ZIP_MAGIC);
    await expect(isFileContentValid(file, DOCUMENT_MIME_TYPES)).resolves.toBe(false);
  });
});

describe("verifyUploadedFilesContent", () => {
  it("returns true and keeps every file on disk when all are valid", async () => {
    const cv = writeFixture("cv.pdf", PDF_MAGIC);
    const coverLetter = writeFixture("lettre.pdf", PDF_MAGIC);

    const result = await verifyUploadedFilesContent([cv, coverLetter], DOCUMENT_MIME_TYPES);

    expect(result).toBe(true);
    expect(fs.existsSync(cv.path)).toBe(true);
    expect(fs.existsSync(coverLetter.path)).toBe(true);
  });

  it("returns false and deletes every file in the batch when one is invalid, even the genuinely valid one", async () => {
    const cv = writeFixture("cv.pdf", PDF_MAGIC); // genuine
    const coverLetter = writeFixture("lettre.pdf", HTML_PAYLOAD); // spoofed

    const result = await verifyUploadedFilesContent([cv, coverLetter], DOCUMENT_MIME_TYPES);

    expect(result).toBe(false);
    expect(fs.existsSync(cv.path)).toBe(false);
    expect(fs.existsSync(coverLetter.path)).toBe(false);
  });

  it("ignores a missing optional file (undefined) in the batch, e.g. no cover letter submitted", async () => {
    const cv = writeFixture("cv.pdf", PDF_MAGIC);
    const result = await verifyUploadedFilesContent([cv, undefined], DOCUMENT_MIME_TYPES);
    expect(result).toBe(true);
    expect(fs.existsSync(cv.path)).toBe(true);
  });
});
