"use client";

import { useState } from "react";

type Report = {
  summary: string;
  strengths: string[];
  improvements: string[];
  nextSession: string;
  source: "model" | "rubric";
};

export function EvaluateForm() {
  const [kind, setKind] = useState<"exercise" | "training" | "match">("training");
  const [notes, setNotes] = useState("");
  const [playerA, setPlayerA] = useState("");
  const [playerB, setPlayerB] = useState("");
  const [score, setScore] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  return (
    <div className="wrap platform-form">
      <form
        className="platform-card"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          const res = await fetch("/api/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind, notes, playerA, playerB, score }),
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error ?? "Gagal");
            return;
          }
          setReport(data.report);
        }}
      >
        <label htmlFor="kind">Jenis evaluasi</label>
        <select id="kind" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="exercise">Latihan</option>
          <option value="training">Sesi latihan</option>
          <option value="match">Pertandingan</option>
        </select>
        <label htmlFor="notes">Catatan</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} required />
        {kind === "match" ? (
          <>
            <label htmlFor="playerA">Pemain A</label>
            <input id="playerA" value={playerA} onChange={(e) => setPlayerA(e.target.value)} />
            <label htmlFor="playerB">Pemain B</label>
            <input id="playerB" value={playerB} onChange={(e) => setPlayerB(e.target.value)} />
            <label htmlFor="score">Skor</label>
            <input id="score" value={score} onChange={(e) => setScore(e.target.value)} />
          </>
        ) : null}
        {error ? <p className="banner error">{error}</p> : null}
        <button type="submit" className="btn btn-hot">
          Kirim evaluasi
        </button>
      </form>

      {report ? (
        <article className="platform-card">
          <p className="lbl">
            Sumber: {report.source === "rubric" ? "rubrik otomatis" : "model AI"}
          </p>
          <h2 className="cond">Ringkasan</h2>
          <p>{report.summary}</p>
          <h2 className="cond">Kekuatan</h2>
          <ul>
            {report.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h2 className="cond">Perbaikan</h2>
          <ul>
            {report.improvements.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h2 className="cond">Sesi berikutnya</h2>
          <p>{report.nextSession}</p>
        </article>
      ) : null}
    </div>
  );
}