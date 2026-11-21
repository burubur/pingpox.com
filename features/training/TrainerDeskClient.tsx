"use client";

import { useRouter } from "next/navigation";

export function TrainerDeskClient({
  pendingSubs,
  customRequests,
}: {
  pendingSubs: Array<{ id: string; name: string; method: string; courseShape: string }>;
  customRequests: Array<{
    id: string;
    name: string;
    goal: string;
    sessionCount: number;
    topicIds: string[];
  }>;
}) {
  const router = useRouter();

  return (
    <div className="wrap list">
      <section className="sec">
        <h2>Langganan menunggu</h2>
        {pendingSubs.length === 0 ? (
          <p className="meta">Tidak ada.</p>
        ) : (
          pendingSubs.map((s) => (
            <div key={s.id} className="platform-card">
              <p>
                <strong>{s.name}</strong>
              </p>
              <p className="meta">
                {s.method} · {s.courseShape}
              </p>
              <div className="actions">
                <button
                  type="button"
                  className="btn btn-hot"
                  onClick={async () => {
                    await fetch("/api/training/confirm", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ subscriptionId: s.id, action: "confirm" }),
                    });
                    router.refresh();
                  }}
                >
                  Konfirmasi
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={async () => {
                    await fetch("/api/training/confirm", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ subscriptionId: s.id, action: "decline" }),
                    });
                    router.refresh();
                  }}
                >
                  Tolak
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="sec">
        <h2>Permintaan kursus kustom</h2>
        {customRequests.length === 0 ? (
          <p className="meta">Tidak ada.</p>
        ) : (
          customRequests.map((r) => (
            <div key={r.id} className="platform-card">
              <p>
                <strong>{r.name}</strong>
              </p>
              <p>{r.goal}</p>
              <p className="meta">
                {r.sessionCount} sesi · {r.topicIds.join(", ")}
              </p>
              <div className="actions">
                <button
                  type="button"
                  className="btn btn-hot"
                  onClick={async () => {
                    const sessions = Array.from({ length: r.sessionCount }, (_, i) => ({
                      durationHours: 2,
                      topicIds: r.topicIds,
                      drills: [`Fokus kustom sesi ${i + 1}`],
                    }));
                    await fetch("/api/training/custom", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "accept", requestId: r.id, sessions }),
                    });
                    router.refresh();
                  }}
                >
                  Terima
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={async () => {
                    await fetch("/api/training/custom", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        action: "decline",
                        requestId: r.id,
                        reason: "Belum sesuai jadwal",
                      }),
                    });
                    router.refresh();
                  }}
                >
                  Tolak
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
