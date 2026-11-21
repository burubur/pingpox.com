"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StaffDrawClient({
  eventId,
  eventTitle,
  entries,
  matches,
}: {
  eventId: string;
  eventTitle: string;
  entries: Array<{ id: string; name: string; status: string }>;
  matches: Array<{ id: string; label: string; scoreA: number | null; scoreB: number | null }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [scores, setScores] = useState<Record<string, { a: string; b: string }>>({});

  async function run(body: Record<string, unknown>) {
    const res = await fetch("/api/staff/draw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setMessage(res.ok ? "Berhasil." : data.error ?? "Gagal");
    router.refresh();
  }

  return (
    <div className="wrap list">
      <section className="sec">
        <h2>{eventTitle}</h2>
        <div className="actions">
          <button type="button" className="btn btn-hot" onClick={() => run({ action: "buildQualification", eventId })}>
            Bangun kualifikasi
          </button>
          <button type="button" className="btn btn-light" onClick={() => run({ action: "advance", eventId })}>
            Lanjut eliminasi
          </button>
        </div>
      </section>

      <section className="sec">
        <h2>Peserta</h2>
        <div className="dgrid">
          {entries.map((e) => (
            <div key={e.id} className="dtile">
              <i aria-hidden>·</i>
              <span>
                {e.name} · {e.status}
                {e.status !== "confirmed" ? (
                  <button
                    type="button"
                    className="btn btn-hot"
                    style={{ marginLeft: 8, minHeight: 36, padding: "4px 10px", fontSize: 13 }}
                    onClick={() => run({ action: "setEntry", entryId: e.id, status: "confirmed" })}
                  >
                    Konfirmasi
                  </button>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="sec">
        <h2>Pertandingan</h2>
        {matches.map((m) => (
          <div key={m.id} className="platform-card">
            <p>{m.label}</p>
            {m.scoreA == null ? (
              <div className="actions">
                <input
                  className="platform-form"
                  style={{ width: 72, minHeight: 40 }}
                  placeholder="A"
                  aria-label="Skor A"
                  value={scores[m.id]?.a ?? ""}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [m.id]: { a: e.target.value, b: prev[m.id]?.b ?? "" },
                    }))
                  }
                />
                <input
                  style={{ width: 72, minHeight: 40, border: "1px solid #cfd3dc", borderRadius: 10, padding: 8 }}
                  placeholder="B"
                  aria-label="Skor B"
                  value={scores[m.id]?.b ?? ""}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [m.id]: { a: prev[m.id]?.a ?? "", b: e.target.value },
                    }))
                  }
                />
                <button
                  type="button"
                  className="btn btn-hot"
                  onClick={() =>
                    run({
                      action: "recordScore",
                      matchId: m.id,
                      scoreA: Number(scores[m.id]?.a ?? 0),
                      scoreB: Number(scores[m.id]?.b ?? 0),
                    })
                  }
                >
                  Catat skor
                </button>
              </div>
            ) : (
              <p className="meta">
                {m.scoreA}-{m.scoreB}
              </p>
            )}
          </div>
        ))}
      </section>
      {message ? <p className="banner">{message}</p> : null}
    </div>
  );
}
