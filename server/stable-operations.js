// Stable-scoped operations use the same transactions, permissions and audit log as core records.
export function stableOperations(c) {
  const {
    app,
    owner,
    records,
    record,
    put,
    get,
    all,
    run,
    transaction,
    fail,
    text,
    integer,
    iso,
    id,
    now,
    audit,
    notify,
    mailDetails,
    createPaymentRequest,
  } = c;
  const day = (value) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  const active = (b) => b.active !== false;
  function validate(req, kind, b, rid) {
    const org = req.org.id;
    if (kind === "stalls") {
      const name = text(b.nameEn || b.nameAr || b.name, "stall name", 100);
      if (
        records(org, "stalls").some(
          (s) => s.id !== rid && s.name.toLowerCase() === name.toLowerCase(),
        )
      )
        fail("Stall name already exists", 409);
      const capacity = integer(b.capacity ?? 1, "stall capacity", 1, 100);
      const stays = records(org, "boarding").filter(
        (x) =>
          x.stallId === rid && x.status === "active" && x.endDate >= day(now()),
      );
      const crowded = stays.some(
        (s) =>
          stays.filter(
            (x) => x.startDate <= s.startDate && x.endDate >= s.startDate,
          ).length > capacity,
      );
      if (crowded || (!active(b) && stays.length))
        fail(
          "Move current horses before reducing or disabling this stall",
          409,
        );
      return {
        name,
        nameEn: b.nameEn?.trim() || name,
        nameAr: b.nameAr?.trim() || "",
        capacity,
        active: active(b),
        notes: typeof b.notes === "string" ? b.notes.slice(0, 2000) : "",
      };
    }
  }
  function horseAccess(req, hid) {
    const horse = record(req.org.id, "horses", hid);
    const staff = req.org.role === "owner",
      owned = horse.ownerId === req.user.id;
    if (
      !staff &&
      !owned &&
      !get(
        "SELECT id FROM reservations WHERE org_id=? AND horse_id=? AND member_id=? AND status IN ('confirmed','pending_payment')",
        req.org.id,
        hid,
        req.user.id,
      )
    )
      fail("Horse access denied", 403);
    return { horse, staff, owned };
  }
  function photoAccess(req, write = false) {
    const { kind, id: target } = req.params,
      org = req.org.id;
    if (!["horses", "instructors", "members"].includes(kind))
      fail("Invalid photo profile", 404);
    if (kind === "members") {
      if (
        !get(
          "SELECT user_id FROM memberships WHERE org_id=? AND user_id=?",
          org,
          target,
        )
      )
        fail("Member not found", 404);
      if (req.org.role !== "owner" && req.user.id !== target)
        fail("Photo access denied", 403);
    } else {
      const profile = record(org, kind, target);
      if (req.org.role !== "owner") {
        if (write) fail("Staff permission required", 403);
        if (kind === "horses") horseAccess(req, target);
        else {
          const assigned =
            records(org, "horses").some(
              (h) => h.ownerId === req.user.id && h.instructorId === target,
            ) ||
            all(
              "SELECT class_id FROM reservations WHERE org_id=? AND member_id=? AND status IN ('confirmed','pending_payment')",
              org,
              req.user.id,
            ).some((b) => {
              const c = record(org, "classes", b.class_id);
              return c.instructorId === target || c.instructor === profile.name;
            });
          if (!assigned) fail("Instructor photo access denied", 403);
        }
      }
    }
    return "photo:" + org + ":" + kind + ":" + target;
  }
  app.get("/api/photos/:kind/:id", (req, res) => {
    const key = photoAccess(req),
      photoRow = get(
        "SELECT data FROM records WHERE org_id=? AND kind='profilePhotos' AND id=?",
        req.org.id,
        key,
      ),
      photo = photoRow ? JSON.parse(photoRow.data) : null;
    res.json(
      photo
        ? {
            mime: photo.mime,
            content: photo.content,
            updatedAt: photo.updatedAt,
          }
        : { content: null },
    );
  });
  app.put("/api/photos/:kind/:id", (req, res) => {
    const key = photoAccess(req, true),
      b = req.body;
    if (
      typeof b.content !== "string" ||
      b.content.length > 700000 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(b.content)
    )
      fail("Choose a JPEG or PNG photo up to 512 KB");
    const bytes = Buffer.from(b.content, "base64"),
      mime = bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        ? "image/png"
        : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
          ? "image/jpeg"
          : "";
    if (!mime || bytes.length > 512 * 1024)
      fail("Choose a JPEG or PNG photo up to 512 KB");
    transaction(() => {
      put(req.org.id, "profilePhotos", key, {
        mime,
        content: bytes.toString("base64"),
        updatedAt: now(),
        updatedBy: req.user.id,
      });
      audit(req, "photo.update", req.params.id);
    });
    res.json({ mime, content: bytes.toString("base64"), updatedAt: now() });
  });
  app.delete("/api/photos/:kind/:id", (req, res) => {
    const key = photoAccess(req, true);
    transaction(() => {
      run(
        "DELETE FROM records WHERE org_id=? AND kind='profilePhotos' AND id=?",
        req.org.id,
        key,
      );
      audit(req, "photo.remove", req.params.id);
    });
    res.json({ ok: true });
  });
  app.get("/api/horses/:id/profile", (req, res) => {
    const { horse, staff, owned } = horseAccess(req, req.params.id),
      org = req.org.id;
    const care = staff || owned;
    const medical = care
      ? records(org, "medical").filter((x) => x.horseId === horse.id)
      : [];
    const feeding = care
      ? records(org, "feeding").filter((x) => x.horseId === horse.id)
      : [];
    const medicalIds = new Set(medical.map((x) => x.id)),
      feedIds = new Set(feeding.map((x) => x.id));
    const tasks = care
      ? records(org, "tasks").filter(
          (x) => medicalIds.has(x.medicalId) || feedIds.has(x.feedingPlanId),
        )
      : [];
    const documents = care
      ? records(org, "horseDocuments").filter((x) => x.horseId === horse.id)
      : [];
    const boarding = care
      ? records(org, "boarding")
          .filter((x) => x.horseId === horse.id)
          .map((x) => ({ ...x, stall: record(org, "stalls", x.stallId).name }))
      : [];
    const bookings = all(
      "SELECT * FROM reservations WHERE org_id=? AND horse_id=?" +
        (staff ? "" : " AND member_id=?"),
      ...[org, horse.id, ...(staff ? [] : [req.user.id])],
    ).map((b) => ({
      ...b,
      session: record(org, "classes", b.class_id),
      memberName:
        get("SELECT name FROM users WHERE id=?", b.member_id)?.name || "",
      attendance:
        get(
          "SELECT status FROM attendance WHERE org_id=? AND reservation_id=?",
          org,
          b.id,
        )?.status || "",
    }));
    const events = [
      ...medical.map((x) => ({
        id: x.id,
        date: x.date,
        type: "medical",
        title: x.type,
        details: x.notes,
      })),
      ...tasks
        .filter((x) => x.done)
        .map((x) => ({
          id: x.id,
          date: x.completedAt,
          type: "completed",
          title: x.title,
          details: staff
            ? get("SELECT name FROM users WHERE id=?", x.completedBy)?.name ||
              ""
            : "",
        })),
      ...bookings.map((x) => ({
        id: x.id,
        date: x.session.startsAt,
        type: "class",
        title: x.session.title,
        details: x.status,
      })),
      ...documents.map((x) => ({
        id: x.id,
        date: x.createdAt,
        type: "document",
        title: x.title,
        details: x.category,
      })),
      ...boarding.map((x) => ({
        id: x.id,
        date: x.startDate + "T00:00:00+03:00",
        type: "boarding",
        title: x.stall,
        details: x.status,
      })),
    ].sort((a, b) => b.date.localeCompare(a.date));
    res.json({
      ownerName:
        (staff || owned) && horse.ownerId
          ? get("SELECT name FROM users WHERE id=?", horse.ownerId)?.name || ""
          : "",
      instructor: horse.instructorId
        ? record(org, "instructors", horse.instructorId)
        : null,
      horse:
        staff || owned
          ? horse
          : {
              id: horse.id,
              name: horse.name,
              nameEn: horse.nameEn,
              nameAr: horse.nameAr,
              breed: horse.breed,
              status: horse.status,
            },
      medical,
      feeding,
      tasks: tasks.map((t) => ({
        ...t,
        completedByName: t.completedBy
          ? get("SELECT name FROM users WHERE id=?", t.completedBy)?.name || ""
          : "",
      })),
      documents,
      boarding,
      bookings,
      events,
    });
  });
  app.post("/api/horses/:id/documents", owner, (req, res) => {
    record(req.org.id, "horses", req.params.id);
    const b = req.body,
      title = text(b.titleEn || b.titleAr || b.title, "document title", 100),
      filename = text(b.filename, "filename", 150).replace(
        /[^\p{L}\p{N}._ -]/gu,
        "_",
      );
    if (
      !["passport", "vaccination", "medical", "ownership", "other"].includes(
        b.category,
      )
    )
      fail("Invalid document category");
    if (
      typeof b.content !== "string" ||
      b.content.length > 2800000 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(b.content)
    )
      fail("Use a PDF, PNG or JPEG document up to 2 MB");
    const bytes = Buffer.from(b.content, "base64");
    const mime =
      bytes.subarray(0, 5).toString() === "%PDF-"
        ? "application/pdf"
        : bytes
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          ? "image/png"
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
            ? "image/jpeg"
            : "";
    if (!mime || bytes.length > 2 * 1024 * 1024)
      fail("Use a PDF, PNG or JPEG document up to 2 MB");
    const did = id(),
      metadata = {
        horseId: req.params.id,
        title,
        titleEn:
          typeof b.titleEn === "string"
            ? b.titleEn.trim().slice(0, 100)
            : title,
        titleAr:
          typeof b.titleAr === "string" ? b.titleAr.trim().slice(0, 100) : "",
        category: b.category,
        filename,
        mime,
        size: bytes.length,
        createdAt: now(),
        createdBy: req.user.id,
      };
    transaction(() => {
      put(req.org.id, "horseDocuments", did, metadata);
      put(req.org.id, "documentContent", did + "-content", {
        content: bytes.toString("base64"),
      });
      audit(req, "document.upload", did);
    });
    res.status(201).json({ id: did, ...metadata });
  });
  app.get("/api/horse-documents/:id", (req, res) => {
    const d = record(req.org.id, "horseDocuments", req.params.id);
    const access = horseAccess(req, d.horseId);
    if (!access.staff && !access.owned) fail("Document access denied", 403);
    const content = record(
      req.org.id,
      "documentContent",
      d.id + "-content",
    ).content;
    res.json({ filename: d.filename, mime: d.mime, content });
  });
  app.delete("/api/horse-documents/:id", owner, (req, res) => {
    record(req.org.id, "horseDocuments", req.params.id);
    transaction(() => {
      run(
        "DELETE FROM records WHERE org_id=? AND id=? AND kind IN ('horseDocuments','documentContent')",
        req.org.id,
        req.params.id,
      );
      run(
        "DELETE FROM records WHERE org_id=? AND id=? AND kind='documentContent'",
        req.org.id,
        req.params.id + "-content",
      );
      audit(req, "document.delete", req.params.id);
    });
    res.json({ ok: true });
  });
  app.post("/api/boarding", owner, (req, res) => {
    const org = req.org.id,
      b = req.body,
      horse = record(org, "horses", b.horseId),
      stall = record(org, "stalls", b.stallId),
      plan = record(org, "plans", b.planId);
    const startDate = iso(b.startDate).slice(0, 10),
      endDate = iso(b.endDate).slice(0, 10);
    if (startDate > endDate) fail("End date precedes start date");
    if (!stall.active) fail("Stall is inactive");
    if (
      ![
        "boarding",
        "boarding_food",
        "boarding_full",
        "boarding_medical",
      ].includes(plan.kind)
    )
      fail("Choose a boarding price");
    const rows = records(org, "boarding").filter(
      (x) =>
        x.status === "active" &&
        x.startDate <= endDate &&
        x.endDate >= startDate,
    );
    if (rows.some((x) => x.horseId === horse.id))
      fail("Horse already has boarding during these dates", 409);
    // Check every occupancy boundary, not the total number of nonconcurrent stays.
    const stays = rows.filter((x) => x.stallId === stall.id);
    for (const date of [
      startDate,
      ...stays.map((x) => x.startDate).filter((d) => d >= startDate),
    ])
      if (
        stays.filter((x) => x.startDate <= date && x.endDate >= date).length >=
        stall.capacity
      )
        fail("Stall capacity is full for these dates", 409);
    const bid = id();
    transaction(() => {
      const invoiceId = createPaymentRequest(
        req,
        b.memberId || horse.ownerId,
        b.planId,
      );
      put(org, "boarding", bid, {
        horseId: horse.id,
        stallId: stall.id,
        memberId: b.memberId || horse.ownerId,
        planId: plan.id,
        startDate,
        endDate,
        status: "active",
        invoiceId,
        createdAt: now(),
      });
      const details = mailDetails(org, b.memberId || horse.ownerId, invoiceId);
      details.boarding = {
        ...record(org, "boarding", bid),
        horseName: horse.name,
        stallName: stall.name,
        planName: plan.name,
      };
      notify(
        org,
        b.memberId || horse.ownerId,
        "Boarding arranged / تم تسجيل الإيواء",
        "Your horse boarding details and payment request. / تفاصيل إيواء خيلك وطلب الدفع.",
        null,
        details,
      );
      audit(req, "boarding.create", bid);
    });
    res.status(201).json(record(org, "boarding", bid));
  });
  app.post("/api/boarding/:id/end", owner, (req, res) => {
    const b = record(req.org.id, "boarding", req.params.id);
    transaction(() => {
      put(req.org.id, "boarding", b.id, {
        ...b,
        status: "ended",
        endedAt: now(),
      });
      notify(
        req.org.id,
        b.memberId,
        "Boarding ended / انتهى الإيواء",
        "Your boarding stay has ended. / انتهت فترة الإيواء.",
        null,
        mailDetails(req.org.id, b.memberId, b.invoiceId),
      );
      audit(req, "boarding.end", b.id);
    });
    res.json({ ok: true });
  });
  app.post("/api/inventory/:id/receive", owner, (req, res) => {
    const amount = integer(req.body.quantity, "received units", 1),
      reference = text(req.body.reference, "delivery reference", 150);
    const item = record(req.org.id, "inventory", req.params.id);
    transaction(() => {
      integer(item.quantity + amount, "stock");
      put(req.org.id, "inventory", item.id, {
        ...item,
        quantity: item.quantity + amount,
      });
      put(req.org.id, "stockMovements", id(), {
        itemId: item.id,
        delta: amount,
        reference,
        createdAt: now(),
        actorId: req.user.id,
      });
      audit(req, "stock.receive", item.id);
    });
    res.json({ ok: true });
  });
  function stockForTask(req, task, done) {
    const org = req.org.id,
      movement = records(org, "stockMovements").find(
        (x) => x.taskId === task.id && x.kind === "feeding" && !x.reversed,
      );
    if (!done && movement) {
      const item = record(org, "inventory", movement.itemId);
      put(org, "inventory", item.id, {
        ...item,
        quantity: item.quantity - movement.delta,
      });
      put(org, "stockMovements", movement.id, {
        ...movement,
        reversed: true,
        reversedAt: now(),
        reversedBy: req.user.id,
      });
      return;
    }
    if (!done || movement || !task.feedingPlanId) return;
    const plan = record(org, "feeding", task.feedingPlanId);
    if (!plan.inventoryId || !plan.stockUnits) return;
    const item = record(org, "inventory", plan.inventoryId);
    if (item.expiresAt && item.expiresAt < now())
      fail("Feed stock has expired", 409);
    if (item.quantity < plan.stockUnits)
      fail(
        "Insufficient feed stock. Receive stock before completing this task.",
        409,
      );
    put(org, "inventory", item.id, {
      ...item,
      quantity: item.quantity - plan.stockUnits,
    });
    put(org, "stockMovements", id(), {
      itemId: item.id,
      delta: -plan.stockUnits,
      taskId: task.id,
      kind: "feeding",
      createdAt: now(),
      actorId: req.user.id,
      reversed: false,
    });
  }
  return { validate, stockForTask };
}
