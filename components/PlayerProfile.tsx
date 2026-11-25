"use client";

import Link from "next/link";
import { useState } from "react";
import { genderLabel, type Player, type PlayerMatch } from "@/lib/player";

const TABS = [
  { id: "hasil", label: "Hasil terkini" },
  { id: "riwayat", label: "Riwayat turnamen" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="player-stat">
      <b>{value === null ? "—" : value.toLocaleString("id")}</b>
      <span>{label}</span>
    </div>
  );
}

function MatchList({ rows, empty }: { rows: PlayerMatch[]; empty: string }) {
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <h3>{empty}</h3>
      </div>
    );
  }
  return (
    <ul className="player-matches">
      {rows.map((row, index) => (
        <li key={`${row.tournament}-${row.when ?? ""}-${index}`}>
          <strong>{row.tournament}</strong>
          <span>{[row.when, row.outcome].filter(Boolean).join(" · ") || "Hasil belum diisi"}</span>
        </li>
      ))}
    </ul>
  );
}

export function PlayerProfile({ player }: { player: Player }) {
  const [tab, setTab] = useState<TabId>("hasil");
  const meta = [genderLabel(player.gender), player.province, player.category].filter(Boolean);

  return (
    <>
      <div className="backbar">
        <div className="wrap">
          <Link href="/pemain">‹ Direktori pemain</Link>
        </div>
      </div>
      <header className="hero player-hero">
        <div className="band">
          <p className="lbl">Pemain</p>
          <h1>{player.name}</h1>
          <p className="player-meta">{meta.length ? meta.join(" · ") : "Provinsi dan kategori belum diisi"}</p>
          <div className="player-stats" aria-label="Statistik">
            <Stat label="Peringkat" value={player.rank} />
            <Stat label="Pertandingan" value={player.matches} />
            <Stat label="Menang" value={player.wins} />
          </div>
        </div>
      </header>
      <div className="tabs">
        <div className="wrap" role="tablist" aria-label="Data pemain">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={item.id}
              className={tab === item.id ? "on" : undefined}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <main className="wrap detail-end">
        <div
          id="hasil"
          role="tabpanel"
          aria-labelledby="tab-hasil"
          hidden={tab !== "hasil"}
        >
          <MatchList rows={player.results} empty="Belum ada hasil terkini." />
        </div>
        <div
          id="riwayat"
          role="tabpanel"
          aria-labelledby="tab-riwayat"
          hidden={tab !== "riwayat"}
        >
          <MatchList rows={player.history} empty="Belum ada riwayat turnamen." />
        </div>
      </main>
    </>
  );
}
