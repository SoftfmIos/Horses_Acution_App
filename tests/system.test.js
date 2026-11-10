import { test } from "node:test";
import assert from "node:assert/strict";
import { openDatabase } from "../server/db.js";
import { createApp } from "../server/app.js";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
async function fixture(t) {
  const db = openDatabase(":memory:");
  const app = createApp(db, { clock: () => new Date("2026-11-11T07:00:00Z") });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(
    () =>
      new Promise((r) =>
        server.close(() => {
          db.close();
          r();
        }),
      ),
  );
  const base = "http://127.0.0.1:" + server.address().port;
  function client() {
    let cookie = "",
      stable = "";
    return {
      get stable() {
        return stable;
      },
      set stable(v) {
        stable = v;
      },
      get cookie() {
        return cookie;
      },
      async call(path, method = "GET", body) {
        const res = await fetch(base + "/api" + path, {
          method,
          headers: {
            Origin: base,
            "X-Requested-With": "RiyadhAcademy",
            "Content-Type": "application/json",
            Cookie: cookie,
            "X-Stable-Id": stable,
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });
        const c = res.headers.get("set-cookie");
        if (c) cookie = c.split(";")[0];
        const result = await res.json();
        return { httpStatus: res.status, ...result };
      },
      async register(email, invite) {
        const r = await this.call("/auth/register", "POST", {
          name: email.split("@")[0],
          email,
          password: "Very secure password 123!",
          stableName: "Academy",
          invite,
        });
        assert.equal(r.httpStatus, 201, JSON.stringify(r));
        const me = await this.call("/auth/me");
        stable = me.stables[0].id;
        return me;
      },
    };
  }
  const owner = client();
  await owner.register("owner@test.com");
  const invite = await owner.call("/invites", "POST");
  const member = client();
  await member.register("member@test.com", invite.code);
  const other = client();
  await other.register("other@test.com");
  async function create(kind, body) {
    const r = await owner.call("/records/" + kind, "POST", body);
    assert.equal(r.httpStatus, 201, JSON.stringify(r));
    return r;
  }
  return { db, app, owner, member, other, create, client, base };
}
async function setup(f, amount = 20000) {
  const horse = await f.create("horses", { name: "Shams", breed: "Arabian" });
  const plan = await f.create("plans", {
    name: "Private lesson",
    amount,
    active: true,
  });
  const cls = await f.create("classes", {
    title: "Lesson",
    startsAt: "2026-11-12T10:00:00Z",
    endsAt: "2026-11-12T11:00:00Z",
    capacity: 1,
    horseIds: [horse.id],
    instructor: "Layla",
    arena: "A",
    planId: plan.id,
  });
  return { horse, plan, cls };
}
test("authentication, tenant isolation, membership roles, CSRF and logout", async (t) => {
  const f = await fixture(t);
  const { horse } = await setup(f);
  const stranger = f.client();
  assert.equal((await stranger.call("/data")).httpStatus, 401);
  assert.equal(
    (await f.member.call("/records/horses", "POST", { name: "bad" }))
      .httpStatus,
    403,
  );
  const otherId = f.other.stable;
  f.other.stable = f.owner.stable;
  assert.equal((await f.other.call("/data")).httpStatus, 403);
  f.other.stable = otherId;
  assert.equal(
    (
      await f.other.call("/records/horses/" + horse.id, "PUT", {
        name: "stolen",
      })
    ).httpStatus,
    404,
  );
  const badOrigin = await fetch(f.base + "/api/auth/logout", {
    method: "POST",
    headers: {
      Cookie: f.owner.cookie,
      Origin: "https://evil.example",
      "X-Requested-With": "RiyadhAcademy",
    },
  });
  assert.equal(badOrigin.status, 403);
  assert.equal((await f.owner.call("/auth/logout", "POST")).httpStatus, 200);
  assert.equal((await f.owner.call("/auth/me")).httpStatus, 401);
  assert.equal(f.db.prepare("SELECT count(*) AS n FROM sessions").get().n, 2);
});
test("single-use invitations and safe passwords", async (t) => {
  const f = await fixture(t);
  const i = await f.owner.call("/invites", "POST");
  const c = f.client();
  assert.equal(
    (
      await c.call("/auth/register", "POST", {
        name: "N",
        email: "n@test.com",
        password: "short",
        invite: i.code,
      })
    ).httpStatus,
    400,
  );
  await c.register("n@test.com", i.code);
  assert.equal(
    (
      await f.client().call("/auth/register", "POST", {
        name: "N",
        email: "x@test.com",
        password: "Long enough password",
        invite: i.code,
      })
    ).httpStatus,
    400,
  );
  const stored = f.db
    .prepare("SELECT password FROM users LIMIT 1")
    .get().password;
  assert.ok(stored.includes(":"));
  assert.ok(!stored.includes("Very secure"));
  assert.equal(
    (
      await f.client().call("/auth/login", "POST", {
        email: "owner@test.com",
        password: "incorrect password",
      })
    ).httpStatus,
    401,
  );
});
test("transactional discount, voucher, pro forma and cancellation restoration", async (t) => {
  const f = await fixture(t);
  const { cls } = await setup(f);
  const d = await f.create("discounts", {
    code: "WELCOME",
    mode: "percent",
    value: 25,
    maxUses: 1,
    minAmount: 10000,
    expiresAt: "2027-01-01",
  });
  const v = await f.create("vouchers", {
    code: "GIFT-SECRET-ABCD",
    balance: 5000,
    expiresAt: "2027-01-01",
  });
  const body = { classId: cls.id, discountCode: d.code, voucherCode: v.code };
  const quote = await f.member.call("/quote", "POST", body);
  assert.deepEqual(
    [quote.gross, quote.discount, quote.voucher, quote.due],
    [20000, 5000, 5000, 10000],
  );
  const booked = await f.member.call("/bookings", "POST", body);
  assert.equal(booked.httpStatus, 201, JSON.stringify(booked));
  let data = await f.owner.call("/data");
  assert.equal(data.vouchers[0].balance, 0);
  assert.equal(data.discounts[0].uses, 1);
  assert.equal(data.proformas[0].due, 10000);
  assert.equal(data.proformas[0].status, "open");
  assert.equal(
    (await f.member.call("/bookings", "POST", { classId: cls.id })).httpStatus,
    409,
  );
  assert.equal(
    (await f.member.call("/bookings/" + booked.id + "/cancel", "POST"))
      .httpStatus,
    200,
  );
  data = await f.owner.call("/data");
  assert.equal(data.vouchers[0].balance, 5000);
  assert.equal(data.discounts[0].uses, 0);
  assert.equal(data.proformas[0].status, "void");
  assert.equal(
    (await f.member.call("/bookings/" + booked.id + "/cancel", "POST"))
      .httpStatus,
    409,
  );
});
test("concurrent bookings cannot oversell capacity", async (t) => {
  const f = await fixture(t);
  const { cls } = await setup(f);
  const results = await Promise.all([
    f.owner.call("/bookings", "POST", { classId: cls.id }),
    f.member.call("/bookings", "POST", { classId: cls.id }),
  ]);
  assert.deepEqual(results.map((r) => r.httpStatus).sort(), [201, 409]);
  assert.equal(
    f.db
      .prepare(
        "SELECT count(*) AS n FROM reservations WHERE status='confirmed'",
      )
      .get().n,
    1,
  );
});
test("medical rest, edit permissions, reminders and feeding task generation", async (t) => {
  const f = await fixture(t);
  const { horse, cls } = await setup(f);
  const me = await f.owner.call("/auth/me");
  const med = await f.create("medical", {
    horseId: horse.id,
    type: "Medication",
    date: "2026-11-11",
    dueAt: "2026-11-12",
    restriction: true,
    notes: "Rest until vet clearance",
    medication: "Prescribed medicine",
    dose: "Veterinary instruction",
  });
  assert.equal(
    (await f.member.call("/bookings", "POST", { classId: cls.id })).httpStatus,
    409,
  );
  assert.equal(
    (
      await f.owner.call("/records/horses/" + horse.id, "PUT", {
        name: "Shams",
        status: "ready",
      })
    ).httpStatus,
    400,
  );
  assert.equal(
    (
      await f.owner.call("/records/medical/" + med.id, "PUT", {
        ...med,
        completed: true,
      })
    ).httpStatus,
    200,
  );
  assert.equal(
    (
      await f.owner.call("/records/horses/" + horse.id, "PUT", {
        name: "Shams",
        status: "ready",
      })
    ).httpStatus,
    200,
  );
  await f.create("feeding", {
    horseId: horse.id,
    feed: "Hay",
    quantity: "2 kg",
    time: "07:00",
    assigneeId: me.user.id,
  });
  let data = await f.owner.call("/data");
  assert.equal(data.tasks.length, 1);
  assert.equal(data.tasks[0].dueAt, "2026-11-11T04:00:00.000Z");
  f.app.locals.remind();
  data = await f.owner.call("/data");
  assert.equal(data.tasks.length, 1);
  const ids = data.notifications.map((n) => n.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(data.notifications.some((n) => n.title.includes("Task due")));
  assert.equal(
    (await f.member.call("/tasks/" + data.tasks[0].id + "/toggle", "POST"))
      .httpStatus,
    403,
  );
  assert.equal(
    (await f.owner.call("/tasks/" + data.tasks[0].id + "/toggle", "POST"))
      .httpStatus,
    200,
  );
});
test("pricing validation, resource conflicts, external payment recording and reports", async (t) => {
  const f = await fixture(t);
  const { horse, cls, plan } = await setup(f);
  assert.equal(
    (await f.owner.call("/records/plans", "POST", { name: "Bad", amount: -1 }))
      .httpStatus,
    400,
  );
  assert.equal(
    (
      await f.owner.call("/records/classes", "POST", {
        ...cls,
        title: "Conflict",
      })
    ).httpStatus,
    409,
  );
  assert.equal(
    (
      await f.owner.call("/records/classes", "POST", {
        ...cls,
        title: "too many",
        capacity: 2,
      })
    ).httpStatus,
    400,
  );
  const booked = await f.member.call("/bookings", "POST", {
    classId: cls.id,
    expectedDue: 100,
  });
  assert.equal(booked.httpStatus, 409);
  const b = await f.member.call("/bookings", "POST", { classId: cls.id });
  assert.equal(
    (
      await f.member.call("/proformas/" + b.proformaId + "/payment", "POST", {
        amount: 100,
      })
    ).httpStatus,
    403,
  );
  assert.equal(
    (
      await f.owner.call("/proformas/" + b.proformaId + "/payment", "POST", {
        amount: 20001,
        reference: "bank",
        externalRef: "ZATCA-1",
      })
    ).httpStatus,
    400,
  );
  assert.equal(
    (
      await f.owner.call("/proformas/" + b.proformaId + "/payment", "POST", {
        amount: 5000,
        reference: "bank",
        externalRef: "ZATCA-1",
      })
    ).httpStatus,
    200,
  );
  assert.equal(
    (await f.member.call("/bookings/" + b.id + "/cancel", "POST")).httpStatus,
    409,
  );
  const r = await f.owner.call("/reports");
  assert.equal(r.recordedPayments, 5000);
  assert.equal(r.outstanding, 15000);
  const d = await f.member.call("/data");
  assert.equal(d.proformas[0].external_ref, "ZATCA-1");
  assert.equal(d.discounts.length, 0);
  assert.equal((await f.member.call("/reports")).httpStatus, 403);
});
test("database survives restart", () => {
  const dir = mkdtempSync(join(tmpdir(), "academy-db-"));
  try {
    let db = openDatabase(join(dir, "test.sqlite"));
    db.prepare("INSERT INTO organizations VALUES(?,?)").run(
      "org",
      "Persistent",
    );
    db.close();
    db = openDatabase(join(dir, "test.sqlite"));
    assert.equal(
      db.prepare("SELECT name FROM organizations").get().name,
      "Persistent",
    );
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("fixed discounts, minimum spend, expiry and immutable voucher issuance", async (t) => {
  const f = await fixture(t);
  const { cls } = await setup(f);
  await f.create("discounts", {
    code: "FIXED",
    mode: "fixed",
    value: 3500,
    maxUses: 2,
    expiresAt: "2027-01-01",
  });
  await f.create("discounts", {
    code: "MIN",
    mode: "percent",
    value: 20,
    minAmount: 30000,
    maxUses: 1,
    expiresAt: "2027-01-01",
  });
  await f.create("discounts", {
    code: "OLD",
    mode: "percent",
    value: 20,
    maxUses: 1,
    expiresAt: "2026-01-01",
  });
  const v = await f.create("vouchers", {
    code: "GIFT-LARGE",
    balance: 30000,
    expiresAt: "2027-01-01",
  });
  let q = await f.member.call("/quote", "POST", {
    classId: cls.id,
    discountCode: "fixed",
    voucherCode: v.code,
  });
  assert.deepEqual([q.discount, q.voucher, q.due], [3500, 16500, 0]);
  assert.equal(
    (
      await f.member.call("/quote", "POST", {
        classId: cls.id,
        discountCode: "MIN",
      })
    ).httpStatus,
    400,
  );
  assert.equal(
    (
      await f.member.call("/quote", "POST", {
        classId: cls.id,
        discountCode: "OLD",
      })
    ).httpStatus,
    400,
  );
  assert.equal(
    (
      await f.owner.call("/records/vouchers/" + v.id, "PUT", {
        ...v,
        balance: 100000,
      })
    ).httpStatus,
    400,
  );
  assert.equal(
    (
      await f.owner.call("/records/discounts", "POST", {
        code: "FIXED",
        mode: "fixed",
        value: 100,
        maxUses: 1,
        expiresAt: "2027-01-01",
      })
    ).httpStatus,
    409,
  );
  const b = await f.member.call("/bookings", "POST", {
    classId: cls.id,
    discountCode: "FIXED",
    voucherCode: v.code,
  });
  assert.equal(b.httpStatus, 201);
  const data = await f.owner.call("/data");
  assert.equal(data.vouchers[0].balance, 13500);
  assert.equal(data.proformas[0].status, "settled");
  assert.equal(
    (await f.member.call("/bookings/" + b.id + "/cancel", "POST")).httpStatus,
    200,
  );
  assert.equal((await f.owner.call("/data")).vouchers[0].balance, 30000);
});
test("manual pro formas and external refund reconciliation retain financial history", async (t) => {
  const f = await fixture(t);
  const { plan } = await setup(f);
  const me = await f.member.call("/auth/me");
  const p = await f.owner.call("/proformas", "POST", {
    memberId: me.user.id,
    planId: plan.id,
  });
  assert.equal(p.httpStatus, 201);
  const payment = {
    amount: 5000,
    reference: "BANK-TRANSFER-1",
    externalRef: "EXTERNAL-INVOICE-1",
  };
  assert.equal(
    (await f.owner.call("/proformas/" + p.id + "/payment", "POST", payment))
      .httpStatus,
    200,
  );
  assert.equal(
    (await f.owner.call("/proformas/" + p.id + "/payment", "POST", payment))
      .httpStatus,
    409,
  );
  assert.equal(
    (
      await f.owner.call("/proformas/" + p.id + "/refund", "POST", {
        amount: 5001,
        reference: "REFUND-1",
        externalRef: "CREDIT-1",
      })
    ).httpStatus,
    400,
  );
  assert.equal(
    (
      await f.owner.call("/proformas/" + p.id + "/refund", "POST", {
        amount: 5000,
        reference: "REFUND-1",
        externalRef: "CREDIT-1",
      })
    ).httpStatus,
    200,
  );
  const ledger = f.db
    .prepare("SELECT amount,external_ref FROM payments ORDER BY created_at")
    .all();
  assert.deepEqual(
    ledger.map((x) => x.amount),
    [5000, -5000],
  );
  assert.equal(ledger[1].external_ref, "CREDIT-1");
  const report = await f.owner.call("/reports");
  assert.equal(report.recordedPayments, 0);
  assert.equal(report.outstanding, 20000);
  assert.equal(
    (await f.other.call("/proformas/" + p.id + "/payment", "POST", payment))
      .httpStatus,
    404,
  );
});
test("notification ownership, reminder deduplication and expiring sessions", async (t) => {
  const f = await fixture(t);
  await setup(f);
  const me = await f.owner.call("/auth/me");
  await f.create("tasks", {
    title: "Check feed",
    dueAt: "2026-11-11T08:00:00Z",
    assigneeId: me.user.id,
  });
  let d = await f.owner.call("/data");
  const notification = d.notifications.find((n) =>
    n.title.includes("Task due"),
  );
  assert.ok(notification);
  await f.member.call("/notifications/" + notification.id + "/read", "POST");
  d = await f.owner.call("/data");
  assert.equal(
    d.notifications.find((n) => n.id === notification.id).read_at,
    null,
  );
  await f.owner.call("/notifications/" + notification.id + "/read", "POST");
  f.app.locals.remind();
  f.app.locals.remind();
  d = await f.owner.call("/data");
  assert.equal(
    d.notifications.filter((n) => n.title.includes("Task due")).length,
    1,
  );
  assert.ok(d.notifications.find((n) => n.id === notification.id).read_at);
  f.db
    .prepare("UPDATE sessions SET expires_at=? WHERE user_id=?")
    .run("2020-01-01T00:00:00Z", me.user.id);
  assert.equal((await f.owner.call("/data")).httpStatus, 401);
});
test("email-enabled notifications enter durable outbox without exposing email addresses to members", async (t) => {
  const db = openDatabase(":memory:");
  const app = createApp(db, { emailEnabled: true });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(
    () =>
      new Promise((r) =>
        server.close(() => {
          db.close();
          r();
        }),
      ),
  );
  const base = "http://127.0.0.1:" + server.address().port;
  const res = await fetch(base + "/api/auth/register", {
    method: "POST",
    headers: {
      Origin: base,
      "X-Requested-With": "RiyadhAcademy",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Mail test",
      email: "mail@test.com",
      password: "Long secure password",
      stableName: "Mail Stable",
    }),
  });
  assert.equal(res.status, 201);
  const job = db.prepare("SELECT * FROM email_outbox").get();
  assert.equal(job.status, "pending");
  assert.ok(job.subject.includes("Welcome"));
  assert.equal(job.attempts, 0);
});

test("lesson package balance, own-account access, atomic credit use, cancellation and refund", async (t) => {
  const f = await fixture(t);
  const { cls } = await setup(f);
  const packagePlan = await f.create("plans", {
    name: "One lesson pack",
    kind: "package",
    amount: 10000,
    credits: 1,
    active: true,
  });
  const order = await f.member.call("/packages", "POST", {
    planId: packagePlan.id,
    memberId: (await f.owner.call("/auth/me")).user.id,
  });
  assert.equal(order.httpStatus, 201);
  let d = await f.member.call("/data");
  assert.equal(
    d.proformas[0].member_id,
    (await f.member.call("/auth/me")).user.id,
  );
  assert.equal(d.creditBalance, 0);
  assert.equal(
    (
      await f.member.call("/bookings", "POST", {
        classId: cls.id,
        useCredits: true,
      })
    ).httpStatus,
    409,
  );
  await f.owner.call("/proformas/" + order.id + "/payment", "POST", {
    amount: 5000,
    reference: "PART-1",
    externalRef: "INV-1",
  });
  assert.equal((await f.member.call("/data")).creditBalance, 0);
  await f.owner.call("/proformas/" + order.id + "/payment", "POST", {
    amount: 5000,
    reference: "PART-2",
    externalRef: "INV-1",
  });
  assert.equal((await f.member.call("/data")).creditBalance, 1);
  assert.equal((await f.other.call("/data")).creditBalance, 0);
  assert.equal(
    (
      await f.member.call("/quote", "POST", {
        classId: cls.id,
        useCredits: true,
        discountCode: "ANY",
      })
    ).httpStatus,
    400,
  );
  assert.equal(
    (
      await f.member.call("/bookings", "POST", {
        classId: cls.id,
        useCredits: true,
        expectedDue: 0,
        expectedGross: 0,
        expectedCredits: 2,
      })
    ).httpStatus,
    409,
  );
  const c2 = await f.create("classes", {
    ...cls,
    title: "Second lesson",
    startsAt: "2026-11-13T10:00:00Z",
    endsAt: "2026-11-13T11:00:00Z",
  });
  const [a, b] = await Promise.all([
    f.member.call("/bookings", "POST", { classId: cls.id, useCredits: true }),
    f.member.call("/bookings", "POST", { classId: c2.id, useCredits: true }),
  ]);
  assert.deepEqual([a.httpStatus, b.httpStatus].sort(), [201, 409]);
  d = await f.member.call("/data");
  assert.equal(d.creditBalance, 0);
  assert.equal(
    d.creditLedger.filter((l) => l.reason === "booking.used").length,
    1,
  );
  const booking = a.httpStatus === 201 ? a : b;
  const refund = {
    amount: 10000,
    reference: "PACKAGE-REFUND",
    externalRef: "CREDIT-1",
  };
  assert.equal(
    (await f.owner.call("/proformas/" + order.id + "/refund", "POST", refund))
      .httpStatus,
    409,
  );
  assert.equal(
    (await f.member.call("/bookings/" + booking.id + "/cancel", "POST"))
      .httpStatus,
    200,
  );
  assert.equal((await f.member.call("/data")).creditBalance, 1);
  assert.equal(
    (await f.owner.call("/proformas/" + order.id + "/refund", "POST", refund))
      .httpStatus,
    200,
  );
  d = await f.member.call("/data");
  assert.equal(d.creditBalance, 0);
  assert.equal(d.creditLedger.length, 4);
  assert.equal((await f.owner.call("/reports")).recordedPayments, 0);
});

test("HTTPS production cookie policy and login sessions do not expose credential material", async (t) => {
  const db = openDatabase(":memory:");
  const app = createApp(db, {
    production: true,
    publicOrigin: "https://academy.example.com",
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  t.after(
    () =>
      new Promise((r) =>
        server.close(() => {
          db.close();
          r();
        }),
      ),
  );
  const base = "http://127.0.0.1:" + server.address().port;
  const body = {
    name: "Production test",
    email: "production@test.com",
    password: "Secure production test password",
    stableName: "Prod",
  };
  let response = await fetch(base + "/api/auth/register", {
    method: "POST",
    headers: {
      Origin: "https://academy.example.com",
      "X-Requested-With": "RiyadhAcademy",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  assert.equal(response.status, 201);
  const cookie = response.headers.get("set-cookie");
  assert.ok(cookie.includes("Secure"));
  assert.ok(cookie.includes("HttpOnly"));
  assert.ok(cookie.includes("SameSite=Strict"));
  const raw = cookie.split(";")[0].split("=")[1];
  assert.notEqual(db.prepare("SELECT token FROM sessions").get().token, raw);
  response = await fetch(base + "/api/auth/login", {
    method: "POST",
    headers: {
      Origin: "https://wrong.example.com",
      "X-Requested-With": "RiyadhAcademy",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  assert.equal(response.status, 403);
});
