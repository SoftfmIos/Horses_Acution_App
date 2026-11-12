import React, { useEffect, useState, useId } from "react";
import { Camera, UserRound } from "lucide-react";
export function ProfilePhoto({
  kind,
  id,
  name,
  request,
  editable = false,
  removable = editable,
  ar = false,
  compact = false,
}) {
  const [photo, setPhoto] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    inputId = useId();
  const l = (en, a) => (ar ? a : en),
    path = "/photos/" + kind + "/" + id;
  useEffect(() => {
    let active = true;
    setPhoto(null);
    request(path)
      .then((p) => {
        if (active) setPhoto(p.content ? p : null);
      })
      .catch(() => {});
    const updated = (e) => {
      if (e.detail.kind === kind && e.detail.id === id)
        setPhoto(e.detail.photo);
    };
    window.addEventListener("academy-photo-updated", updated);
    return () => {
      active = false;
      window.removeEventListener("academy-photo-updated", updated);
    };
  }, [kind, id]);
  async function upload(file) {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      if (
        !["image/jpeg", "image/png"].includes(file.type) ||
        file.size > 10 * 1024 * 1024
      )
        throw Error(
          l(
            "Choose a JPEG or PNG up to 10 MB.",
            "اختر صورة JPEG أو PNG لا تتجاوز 10 MB.",
          ),
        );
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas"),
        ratio = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
      canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const content = canvas.toDataURL("image/jpeg", 0.82).split(",")[1];
      const saved = await request(path, { method: "PUT", body: { content } });
      setPhoto(saved);
      window.dispatchEvent(
        new CustomEvent("academy-photo-updated", {
          detail: { kind, id, photo: saved },
        }),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className={"profile-photo" + (compact ? " compact-profile-photo" : "")}
    >
      <div className="profile-photo-image">
        {photo ? (
          <img
            src={"data:" + photo.mime + ";base64," + photo.content}
            alt={name || l("Profile photo", "صورة الملف")}
          />
        ) : (
          <UserRound aria-hidden="true" size={30} />
        )}
      </div>
      {(editable || removable) && (
        <div className="profile-photo-actions">
          {editable && (
            <>
              <label className="soft photo-upload-label" htmlFor={inputId}>
                <Camera size={16} />
                {busy
                  ? l("Saving…", "جار الحفظ…")
                  : l("Change photo", "تغيير الصورة")}
              </label>
              <input
                id={inputId}
                aria-label={
                  l("Upload photo for ", "رفع صورة ") + (name || kind)
                }
                type="file"
                accept="image/jpeg,image/png"
                disabled={busy}
                onChange={(e) => {
                  upload(e.target.files[0]);
                  e.target.value = "";
                }}
              />
            </>
          )}
          {photo && removable && (
            <button
              className="text-button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await request(path, { method: "DELETE" });
                  setPhoto(null);
                  window.dispatchEvent(
                    new CustomEvent("academy-photo-updated", {
                      detail: { kind, id, photo: null },
                    }),
                  );
                  setError("");
                } catch (e) {
                  setError(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {l("Remove photo", "حذف الصورة")}
            </button>
          )}
        </div>
      )}
      {error && (
        <p role="alert" className="photo-error">
          {error}
        </p>
      )}
    </div>
  );
}
