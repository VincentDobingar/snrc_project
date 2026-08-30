import { describe, it, expect, vi, beforeEach } from "vitest";

const queryMock = vi.fn();

vi.mock("../config/db.js", () => ({
  query: (...args) => queryMock(...args),
}));

const { SettingsModel } = await import("./settings.model.js");

describe("SettingsModel.update", () => {
  beforeEach(() => {
    queryMock.mockReset();
  });

  it("issues exactly one query() call (no more SELECT-then-branch race condition)", async () => {
    queryMock.mockResolvedValue({ rows: [{ id: 1, site_name: "Test" }] });
    await SettingsModel.update({ site_name: "Test" });
    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it("uses an atomic ON CONFLICT upsert", async () => {
    queryMock.mockResolvedValue({ rows: [{ id: 1 }] });
    await SettingsModel.update({ site_name: "Test" });
    const [sql] = queryMock.mock.calls[0];
    expect(sql).toMatch(/ON CONFLICT/);
  });

  it("passes null (not undefined) for omitted fields, at the correct positional index", async () => {
    queryMock.mockResolvedValue({ rows: [{ id: 1 }] });
    await SettingsModel.update({ site_name: "Only This" });
    const [, params] = queryMock.mock.calls[0];

    // Positional order per the INSERT column list:
    // site_name, site_tagline, site_description, contact_email, contact_phone,
    // contact_phone_secondary, address, footer_text, logo_url, favicon_url,
    // facebook_url, linkedin_url, x_url, youtube_url
    expect(params).toHaveLength(14);
    expect(params[0]).toBe("Only This");
    for (let i = 1; i < params.length; i += 1) {
      expect(params[i]).toBeNull();
      expect(params[i]).not.toBeUndefined();
    }
  });

  it("resolves to the row returned by query() (return-shape contract preserved)", async () => {
    const row = { id: 1, site_name: "Test" };
    queryMock.mockResolvedValue({ rows: [row] });
    const result = await SettingsModel.update({ site_name: "Test" });
    expect(result).toEqual(row);
  });
});
