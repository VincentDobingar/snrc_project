import fs from "fs/promises";
import path from "path";
import { fileTypeFromFile } from "file-type";

// Le format binaire "legacy" d'Office (.doc/.xls/.ppt) utilise, pour Word,
// Excel et PowerPoint, exactement le même conteneur "Compound File Binary"
// (OLE2) : file-type ne peut donc y détecter que le conteneur générique
// `application/x-cfb`, jamais application/msword vs .ms-excel vs
// .ms-powerpoint précisément. Rejeter sur ce mismatch rejetterait donc tout
// upload legacy légitime : pour ces trois extensions on accepte un conteneur
// CFB détecté comme preuve suffisante plutôt que de comparer au mime précis.
const LEGACY_OFFICE_EXTENSIONS = new Set([".doc", ".xls", ".ppt"]);
const CFB_MIME = "application/x-cfb";

async function deleteQuietly(filePath) {
  try {
    await fs.unlink(filePath);
  } catch {
    // fichier déjà supprimé / inaccessible : rien de plus à faire ici
  }
}

// Vérifie le contenu réel (octets magiques) d'un fichier déjà écrit sur disque
// par multer, en le comparant à l'allowlist de mimetypes déjà appliquée par
// `buildFileFilter` (src/middlewares/upload.js). Ce premier filtre ne regarde
// que des métadonnées multipart déclarées par le client (mimetype, extension
// du nom de fichier) — toutes deux entièrement falsifiables par un attaquant
// — donc il ne protège pas contre un fichier dont les octets réels ne
// correspondent pas à ce qu'il prétend être (ex : un payload HTML/JS renommé
// en "cv.pdf" avec un Content-Type falsifié en "application/pdf").
//
// Doit impérativement s'exécuter APRÈS que multer ait écrit le fichier sur
// disque : le sniffing d'octets magiques a besoin des octets réels, pas des
// champs multipart pré-upload (fileFilter n'a accès qu'à ces derniers, avant
// la fin du flux).
export async function isFileContentValid(file, allowedMimeTypes) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const detected = await fileTypeFromFile(file.path);

  if (LEGACY_OFFICE_EXTENSIONS.has(ext)) {
    return detected?.mime === CFB_MIME;
  }

  // Tous les autres formats acceptés (pdf, docx/xlsx/pptx, png/jpeg/webp) ont
  // une signature d'octets magiques réelle et distincte que file-type détecte
  // de façon fiable : un type non détecté ici signifie que les octets ne
  // correspondent à aucun format connu, ce qui est déjà suspect pour un
  // fichier prétendant être l'un de ces formats.
  return Boolean(detected) && allowedMimeTypes.includes(detected.mime);
}

// Valide un lot de fichiers multer venant d'être uploadés (req.file ou les
// valeurs de req.files) par rapport à `allowedMimeTypes`, en inspectant leur
// contenu réel sur disque. Si un seul fichier du lot échoue, supprime TOUS
// les fichiers du lot (pas seulement le fautif) afin qu'une requête
// multi-fichiers (ex : CV + lettre de motivation) ne laisse jamais un fichier
// "valide" orphelin sur disque alors que la requête entière est rejetée.
export async function verifyUploadedFilesContent(files, allowedMimeTypes) {
  const list = files.filter(Boolean);
  if (list.length === 0) return true;

  const results = await Promise.all(list.map((file) => isFileContentValid(file, allowedMimeTypes)));
  const allValid = results.every(Boolean);
  if (!allValid) {
    await Promise.all(list.map((file) => deleteQuietly(file.path)));
  }
  return allValid;
}
