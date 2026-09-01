import { describe, it, expect, beforeEach, vi } from "vitest";
import { isAccountLocked, recordFailedLogin, clearFailedLogins } from "./accountLockout.js";

describe("accountLockout", () => {
  const email = `lockout-test-${Math.random()}@example.com`;

  beforeEach(() => {
    clearFailedLogins(email);
  });

  it("is not locked with no recorded failures", () => {
    expect(isAccountLocked(email)).toBe(false);
  });

  it("locks after 10 failed attempts within the window, and is case/whitespace insensitive", () => {
    for (let i = 0; i < 9; i += 1) recordFailedLogin(email);
    expect(isAccountLocked(email)).toBe(false);

    recordFailedLogin(email);
    expect(isAccountLocked(email)).toBe(true);
    expect(isAccountLocked(`  ${email.toUpperCase()}  `)).toBe(true);
  });

  it("clearFailedLogins resets the lockout", () => {
    for (let i = 0; i < 10; i += 1) recordFailedLogin(email);
    expect(isAccountLocked(email)).toBe(true);

    clearFailedLogins(email);
    expect(isAccountLocked(email)).toBe(false);
  });

  it("expires the lockout window after 15 minutes", () => {
    vi.useFakeTimers();
    try {
      for (let i = 0; i < 10; i += 1) recordFailedLogin(email);
      expect(isAccountLocked(email)).toBe(true);

      vi.advanceTimersByTime(15 * 60 * 1000 + 1);
      expect(isAccountLocked(email)).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
