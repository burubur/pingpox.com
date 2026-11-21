"use client";

import { useState } from "react";

export function CustomRequestForm({
  subscriptionId,
  topics,
}: {
  subscriptionId: string;
  topics: Array<{ id: string; title: string }>;
}) {
  const [goal, setGoal] = useState("");
  const [sessionCount, setSessionCount] = useState("4");
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  return (
    <form
      className="platform-card"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/training/custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "request",
            subscriptionId,
            goal,
            sessionCount: Number(sessionCount),
            topicIds,
          }),
        });
        const data = await res.json();
        setMessage(res.ok ? "Permintaan terkirim." : data.error ?? "Gagal");
      }}
    >
      <h2 className="cond">Ajukan latihan kustom</h2>
      <label htmlFor="goal">Tujuan latihan</label>
      <input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} required />
      <label htmlFor="sessionCount">Jumlah sesi</label>
      <input
        id="sessionCount"
        type="number"
        min={1}
        value={sessionCount}
        onChange={(e) => setSessionCount(e.target.value)}
        required
      />
      <p className="lbl">Topik</p>
      <div>
        {topics.map((topic) => {
          const on = topicIds.includes(topic.id);
          return (
            <button
              key={topic.id}
              type="button"
              className={`platform-chip ${on ? "on" : ""}`}
              onClick={() =>
                setTopicIds((prev) =>
                  on ? prev.filter((x) => x !== topic.id) : [...prev, topic.id],
                )
              }
            >
              {topic.title}
            </button>
          );
        })}
      </div>
      <button type="submit" className="btn btn-hot">
        Kirim permintaan
      </button>
      {message ? <p className="banner">{message}</p> : null}
    </form>
  );
}