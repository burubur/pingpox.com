"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export function EnrollForm({
  signedIn,
}: {
  signedIn: boolean;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<"monthly" | "one_time">("monthly");
  const [courseShape, setCourseShape] = useState<"oyuda" | "custom">("oyuda");
  const [message, setMessage] = useState("");

  if (!signedIn) {
    return (
      <p className="notes">
        <Link href="/daftar">Daftar akun</Link> atau <Link href="/masuk">masuk</Link> untuk mendaftar
        latihan.
      </p>
    );
  }

  return (
    <div className="platform-card">
      <p className="lbl">Metode pembayaran</p>
      <div className="actions">
        <button
          type="button"
          className={`platform-chip ${method === "monthly" ? "on" : ""}`}
          onClick={() => setMethod("monthly")}
        >
          Bulanan
        </button>
        <button
          type="button"
          className={`platform-chip ${method === "one_time" ? "on" : ""}`}
          onClick={() => setMethod("one_time")}
        >
          Satu kali
        </button>
      </div>
      <p className="lbl">Paket latihan</p>
      <div className="actions">
        <button
          type="button"
          className={`platform-chip ${courseShape === "oyuda" ? "on" : ""}`}
          onClick={() => setCourseShape("oyuda")}
        >
          Oyuda
        </button>
        <button
          type="button"
          className={`platform-chip ${courseShape === "custom" ? "on" : ""}`}
          onClick={() => setCourseShape("custom")}
        >
          Kustom
        </button>
      </div>
      <button
        type="button"
        className="btn btn-hot"
        onClick={async () => {
          const res = await fetch("/api/training/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method, courseShape }),
          });
          const data = await res.json();
          if (!res.ok) {
            setMessage(data.error ?? "Gagal mendaftar");
            return;
          }
          setMessage("Pendaftaran menunggu konfirmasi pelatih.");
          router.refresh();
        }}
      >
        Daftar latihan
      </button>
      {message ? <p className="banner">{message}</p> : null}
    </div>
  );
}