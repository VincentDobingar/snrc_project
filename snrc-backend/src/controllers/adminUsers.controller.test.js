import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

// Mirrors the mocking pattern already used in auth.controller.test.js: mock
// the models the request chain touches, then import app.js so the real
// express app (with the real requireAuth / requireRole / route wiring) is
// exercised end-to-end via supertest.
const authDbMock = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
  touchLastLogin: vi.fn(),
  getTokenVersion: vi.fn(),
};
vi.mock("../models/auth.model.js", () => ({
  AuthModel: {
    findByEmail: (...a) => authDbMock.findByEmail(...a),
    findById: (...a) => authDbMock.findById(...a),
    touchLastLogin: (...a) => authDbMock.touchLastLogin(...a),
    getTokenVersion: (...a) => authDbMock.getTokenVersion(...a),
  },
}));

const adminUsersMock = {
  listAll: vi.fn(),
  findRawById: vi.fn(),
  create: vi.fn(),
  updateWithGuard: vi.fn(),
  updatePassword: vi.fn(),
  removeWithGuard: vi.fn(),
  bumpTokenVersion: vi.fn(),
};
vi.mock("../models/adminUsers.model.js", () => ({
  AdminUsersModel: {
    listAll: (...a) => adminUsersMock.listAll(...a),
    findRawById: (...a) => adminUsersMock.findRawById(...a),
    create: (...a) => adminUsersMock.create(...a),
    updateWithGuard: (...a) => adminUsersMock.updateWithGuard(...a),
    updatePassword: (...a) => adminUsersMock.updatePassword(...a),
    removeWithGuard: (...a) => adminUsersMock.removeWithGuard(...a),
    bumpTokenVersion: (...a) => adminUsersMock.bumpTokenVersion(...a),
  },
}));

// Defensive, as in auth.controller.test.js: no real Postgres connection is
// available here.
vi.mock("../config/db.js", () => ({
  query: vi.fn().mockResolvedValue({ rows: [] }),
  pool: { on: vi.fn() },
}));

const { default: app } = await import("../app.js");
const { env } = await import("../config/env.js");

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      token_version: user.token_version,
    },
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

const SUPERADMIN = {
  id: 1,
  full_name: "Root",
  email: "root@example.com",
  role: "superadmin",
  status: "active",
  token_version: 1,
};

beforeEach(() => {
  vi.clearAllMocks();
  // Superadmin's own token stays valid for the duration of each test unless
  // a test overrides this.
  authDbMock.getTokenVersion.mockImplementation(async (id) => {
    if (id === SUPERADMIN.id) return SUPERADMIN.token_version;
    return null;
  });
});

describe("PUT /api/admin/users/:id — token revocation on status/role change", () => {
  it("bumps token_version when an admin_editeur is deactivated, and a previously issued token is then rejected", async () => {
    const editeur = {
      id: 2,
      full_name: "Editeur Test",
      email: "editeur@example.com",
      role: "admin_editeur",
      status: "active",
      token_version: 4,
    };
    const staleToken = signToken(editeur); // issued while still active

    adminUsersMock.findRawById.mockResolvedValue(editeur);
    adminUsersMock.updateWithGuard.mockResolvedValue({ ...editeur, status: "inactive" });
    adminUsersMock.bumpTokenVersion.mockResolvedValue({ id: editeur.id, token_version: editeur.token_version + 1 });

    const superadminToken = signToken(SUPERADMIN);
    const res = await request(app)
      .put(`/api/admin/users/${editeur.id}`)
      .set("Authorization", `Bearer ${superadminToken}`) // Bearer auth sidesteps the separate CSRF check
      .send({ status: "inactive" });

    expect(res.status).toBe(200);
    expect(adminUsersMock.bumpTokenVersion).toHaveBeenCalledWith(String(editeur.id));
    // The last-active-superadmin guard (now enforced atomically inside
    // updateWithGuard, see the model) must not be requested for a
    // non-superadmin target.
    expect(adminUsersMock.updateWithGuard).toHaveBeenCalledWith(
      String(editeur.id),
      expect.any(Object),
      { guardLastSuperadmin: false }
    );

    // Simulate the DB having actually applied the bump, then replay the
    // editeur's previously issued (now-stale) token — mirrors the
    // "requireAuth token_version revocation" pattern in auth.controller.test.js.
    authDbMock.getTokenVersion.mockImplementation(async (id) => {
      if (id === SUPERADMIN.id) return SUPERADMIN.token_version;
      if (id === editeur.id) return editeur.token_version + 1;
      return null;
    });

    const meRes = await request(app).get("/api/auth/me").set("Cookie", `${env.COOKIE_NAME}=${staleToken}`);
    expect(meRes.status).toBe(401);
  });

  it("does not bump token_version for an admin_editeur whose status stays active", async () => {
    const editeur = {
      id: 3,
      full_name: "Editeur Actif",
      email: "editeur-actif@example.com",
      role: "admin_editeur",
      status: "active",
      token_version: 2,
    };
    adminUsersMock.findRawById.mockResolvedValue(editeur);
    adminUsersMock.updateWithGuard.mockResolvedValue({ ...editeur, full_name: "Editeur Renommé" });

    const superadminToken = signToken(SUPERADMIN);
    const res = await request(app)
      .put(`/api/admin/users/${editeur.id}`)
      .set("Authorization", `Bearer ${superadminToken}`)
      .send({ full_name: "Editeur Renommé" });

    expect(res.status).toBe(200);
    expect(adminUsersMock.bumpTokenVersion).not.toHaveBeenCalled();
  });

  it("still blocks deactivating the last active superadmin", async () => {
    const target = { ...SUPERADMIN, id: 5, token_version: 1 };
    adminUsersMock.findRawById.mockResolvedValue(target);
    // updateWithGuard now owns the "lock other active superadmins, reject if
    // none remain" check atomically (see adminUsers.model.js) — simulate it
    // rejecting exactly like the real transactional implementation would.
    adminUsersMock.updateWithGuard.mockImplementation(() => {
      const error = new Error("Impossible de désactiver/supprimer le dernier superadministrateur actif");
      error.status = 400;
      return Promise.reject(error);
    });

    const superadminToken = signToken(SUPERADMIN);
    const res = await request(app)
      .put(`/api/admin/users/${target.id}`)
      .set("Authorization", `Bearer ${superadminToken}`)
      .send({ status: "inactive" });

    expect(res.status).toBe(400);
    expect(adminUsersMock.updateWithGuard).toHaveBeenCalledWith(
      String(target.id),
      expect.any(Object),
      { guardLastSuperadmin: true }
    );
    expect(adminUsersMock.bumpTokenVersion).not.toHaveBeenCalled();
  });

  it("still bumps token_version when a superadmin is demoted to admin_editeur (regression check)", async () => {
    const target = { id: 6, full_name: "Superadmin 2", email: "s2@example.com", role: "superadmin", status: "active", token_version: 7 };
    adminUsersMock.findRawById.mockResolvedValue(target);
    // Another active superadmin exists, so updateWithGuard's internal lock
    // check succeeds and resolves normally.
    adminUsersMock.updateWithGuard.mockResolvedValue({ ...target, role: "admin_editeur" });
    adminUsersMock.bumpTokenVersion.mockResolvedValue({ id: target.id, token_version: target.token_version + 1 });

    const superadminToken = signToken(SUPERADMIN);
    const res = await request(app)
      .put(`/api/admin/users/${target.id}`)
      .set("Authorization", `Bearer ${superadminToken}`)
      .send({ role: "admin_editeur" });

    expect(res.status).toBe(200);
    expect(adminUsersMock.updateWithGuard).toHaveBeenCalledWith(
      String(target.id),
      expect.any(Object),
      { guardLastSuperadmin: true }
    );
    expect(adminUsersMock.bumpTokenVersion).toHaveBeenCalledWith(String(target.id));
  });
});

describe("DELETE /api/admin/users/:id — last-active-superadmin guard", () => {
  it("blocks deleting the last active superadmin", async () => {
    const target = { ...SUPERADMIN, id: 7, token_version: 1 };
    adminUsersMock.findRawById.mockResolvedValue(target);
    adminUsersMock.removeWithGuard.mockImplementation(() => {
      const error = new Error("Impossible de désactiver/supprimer le dernier superadministrateur actif");
      error.status = 400;
      return Promise.reject(error);
    });

    const superadminToken = signToken(SUPERADMIN);
    const res = await request(app)
      .delete(`/api/admin/users/${target.id}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(res.status).toBe(400);
    expect(adminUsersMock.removeWithGuard).toHaveBeenCalledWith(String(target.id), { guardLastSuperadmin: true });
  });

  it("allows deleting a superadmin when another active superadmin remains", async () => {
    const target = { id: 8, full_name: "Superadmin 3", email: "s3@example.com", role: "superadmin", status: "active" };
    adminUsersMock.findRawById.mockResolvedValue(target);
    adminUsersMock.removeWithGuard.mockResolvedValue({ id: target.id });

    const superadminToken = signToken(SUPERADMIN);
    const res = await request(app)
      .delete(`/api/admin/users/${target.id}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(res.status).toBe(200);
  });

  it("does not request the guard when deleting a non-superadmin", async () => {
    const target = { id: 9, full_name: "Editeur", email: "e@example.com", role: "admin_editeur", status: "active" };
    adminUsersMock.findRawById.mockResolvedValue(target);
    adminUsersMock.removeWithGuard.mockResolvedValue({ id: target.id });

    const superadminToken = signToken(SUPERADMIN);
    const res = await request(app)
      .delete(`/api/admin/users/${target.id}`)
      .set("Authorization", `Bearer ${superadminToken}`);

    expect(res.status).toBe(200);
    expect(adminUsersMock.removeWithGuard).toHaveBeenCalledWith(String(target.id), { guardLastSuperadmin: false });
  });
});
