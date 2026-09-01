// Verrouillage par compte (email), en complément du rate-limit par IP
// (loginLimiter) : celui-ci ne protège pas un compte ciblé par un attaquant
// répartissant ses tentatives sur plusieurs IP. Stockage en mémoire — suffisant
// pour un seul process Node ; se réinitialise au redémarrage et ne se
// synchronise pas entre plusieurs instances, ce qui est acceptable à l'échelle
// de ce site (pas d'architecture multi-instance).
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

const failedAttempts = new Map(); // email normalisé -> { count, firstAttemptAt }

function normalize(email) {
  return String(email || "").trim().toLowerCase();
}

export function isAccountLocked(email) {
  const key = normalize(email);
  const entry = failedAttempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAttemptAt > WINDOW_MS) {
    failedAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedLogin(email) {
  const key = normalize(email);
  const now = Date.now();
  const entry = failedAttempts.get(key);
  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    failedAttempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }
  entry.count += 1;
}

export function clearFailedLogins(email) {
  failedAttempts.delete(normalize(email));
}
