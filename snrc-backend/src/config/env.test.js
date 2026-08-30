import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const BASE_ENV = {
  DB_HOST: "localhost",
  DB_PORT: "5432",
  DB_NAME: "snrc_db",
  DB_USER: "postgres",
  DB_PASSWORD: "Postgres@2026",
  JWT_SECRET: "a".repeat(32),
};

function applyEnv(overrides) {
  const merged = { ...BASE_ENV, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

const ENV_KEYS = Object.keys(BASE_ENV);
let originalValues;

beforeEach(() => {
  originalValues = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  vi.resetModules();
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (originalValues[key] === undefined) delete process.env[key];
    else process.env[key] = originalValues[key];
  }
});

describe("env.js requireSecret", () => {
  it("throws for a known insecure default value (change_me)", async () => {
    applyEnv({ JWT_SECRET: "change_me" });
    await expect(import("./env.js")).rejects.toThrow();
  });

  it("throws for a known insecure default value (postgres)", async () => {
    applyEnv({ DB_PASSWORD: "postgres" });
    await expect(import("./env.js")).rejects.toThrow();
  });

  it("throws for an empty string secret", async () => {
    applyEnv({ DB_PASSWORD: "" });
    await expect(import("./env.js")).rejects.toThrow();
  });

  it("does NOT throw for a short DB_PASSWORD that isn't a blacklisted default (32-char minimum applies only to JWT_SECRET)", async () => {
    applyEnv({ DB_PASSWORD: "abc" });
    const mod = await import("./env.js");
    expect(mod.env.DB_PASSWORD).toBe("abc");
  });

  it("throws for a short JWT_SECRET (minLength: 32 enforced)", async () => {
    applyEnv({ JWT_SECRET: "too-short" });
    await expect(import("./env.js")).rejects.toThrow(/trop courte/);
  });

  it("accepts a JWT_SECRET at exactly the 32-char minimum", async () => {
    applyEnv({ JWT_SECRET: "b".repeat(32) });
    const mod = await import("./env.js");
    expect(mod.env.JWT_SECRET).toBe("b".repeat(32));
  });
});
