"use client";

import { useEffect, useState } from "react";
import { localMidnight, type DayKey } from "@/lib/tournament";

const UNITS = [
  ["d", "Hari"],
  ["h", "Jam"],
  ["m", "Menit"],
  ["s", "Detik"],
] as const;

/** Live "Dimulai dalam" countdown to local midnight of the start day. Renders dashes until hydrated. */
export default function Countdown({ start }: { start: DayKey }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  let v: Record<"d" | "h" | "m" | "s", string> = { d: "–", h: "–", m: "–", s: "–" };
  let label: string | undefined;
  if (now !== null) {
    const s = Math.floor(Math.max(0, localMidnight(start) - now) / 1000);
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    v = { d: String(d), h: String(h).padStart(2, "0"), m: String(m).padStart(2, "0"), s: String(s % 60).padStart(2, "0") };
    label = `${d} hari ${h} jam ${m} menit lagi`;
  }
  return (
    <div className="cd-wrap">
      <span className="lbl">Dimulai dalam</span>
      <div className="cd" role="timer" aria-label={label}>
        {UNITS.map(([u, name]) => (
          <div key={u}>
            <b>{v[u]}</b>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
