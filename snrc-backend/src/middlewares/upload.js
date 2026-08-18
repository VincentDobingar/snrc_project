import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "../config/env.js";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeFilename(originalname = "file") {
  const ext = path.extname(originalname).toLowerCase();
  const base = path
    .basename(originalname, ext)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return `${Date.now()}-${base}${ext}`;
}

function createStorage(targetFolder) {
  const absoluteDir = path.resolve(process.cwd(), env.UPLOAD_DIR, targetFolder);
  ensureDir(absoluteDir);
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, absoluteDir),
    filename: (_req, file, cb) => cb(null, sanitizeFilename(file.originalname)),
  });
}

function buildFileFilter(allowedMimePrefixes = [], allowedMimeTypes = []) {
  return (_req, file, cb) => {
    const okPrefix = allowedMimePrefixes.some((prefix) => file.mimetype.startsWith(prefix));
    const okType = allowedMimeTypes.includes(file.mimetype);
    if (okPrefix || okType) return cb(null, true);
    return cb(new Error("Unsupported file type"));
  };
}

export function imageUpload(targetFolder = "images") {
  return multer({
    storage: createStorage(targetFolder),
    limits: { fileSize: env.MAX_FILE_SIZE },
    fileFilter: buildFileFilter(["image/"], []),
  });
}

export function documentUpload(targetFolder = "documents") {
  return multer({
    storage: createStorage(targetFolder),
    limits: { fileSize: env.MAX_FILE_SIZE },
    fileFilter: buildFileFilter([], [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/png",
      "image/jpeg",
      "image/webp",
    ]),
  });
}
