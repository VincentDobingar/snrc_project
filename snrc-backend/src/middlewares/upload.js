import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "../config/env.js";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function sanitizeFilename(originalname = "file") {
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

export function buildFileFilter(allowedMimeTypes = [], allowedExtensions = []) {
  return (_req, file, cb) => {
    const okType = allowedMimeTypes.includes(file.mimetype);
    const ext = path.extname(file.originalname).toLowerCase();
    const okExt = allowedExtensions.includes(ext);
    if (okType && okExt) return cb(null, true);
    const error = new Error("Type de fichier non autorisé");
    error.status = 400;
    return cb(error);
  };
}

export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export const DOCUMENT_MIME_TYPES = [
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
];
export const DOCUMENT_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
];

export function imageUpload(targetFolder = "images") {
  return multer({
    storage: createStorage(targetFolder),
    limits: { fileSize: env.MAX_FILE_SIZE },
    fileFilter: buildFileFilter(IMAGE_MIME_TYPES, IMAGE_EXTENSIONS),
  });
}

export function documentUpload(targetFolder = "documents") {
  return multer({
    storage: createStorage(targetFolder),
    limits: { fileSize: env.MAX_FILE_SIZE },
    fileFilter: buildFileFilter(DOCUMENT_MIME_TYPES, DOCUMENT_EXTENSIONS),
  });
}
