import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";

describe("password utils", () => {
  it("hashes and verifies a valid password", () => {
    const password = "super-secret-password";
    const hashed = hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(hashed).toContain(":");
    expect(verifyPassword(password, hashed)).toBe(true);
  });

  it("rejects an invalid password", () => {
    const hashed = hashPassword("correct-password");

    expect(verifyPassword("wrong-password", hashed)).toBe(false);
  });

  it("returns false for malformed hashes", () => {
    expect(verifyPassword("anything", "not-a-valid-hash")).toBe(false);
  });
});
