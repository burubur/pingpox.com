"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { genderLabel, type Player, type PlayerGender } from "@/lib/player";

type GenderFilter = "" | PlayerGender;

const GENDER_OPTIONS: { value: GenderFilter; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "putra", label: "Putra" },
  { value: "putri", label: "Putri" },
];

function sortId(values: Set<string>) {
  return Array.from(values).sort((a, b) => a.localeCompare(b, "id"));
}

export function PlayerDirectory({ players }: { players: Player[] }) {
  const [q, setQ] = useState("");
  const [gender, setGender] = useState<GenderFilter>("");
  const [province, setProvince] = useState("");
  const [category, setCategory] = useState("");

  const options = useMemo(
    () => ({
      provinces: sortId(new Set(players.map((player) => player.province).filter((value): value is string => !!value))),
      categories: sortId(new Set(players.map((player) => player.category).filter((value): value is string => !!value))),
    }),
    [players],
  );

  const query = q.trim().toLowerCase();
  const rows = players.filter((player) => {
    if (gender && player.gender !== gender) return false;
    if (province && player.province !== province) return false;
    if (category && player.category !== category) return false;
    if (!query) return true;
    const haystack = [player.name, player.province, player.category, genderLabel(player.gender)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  const filtered = query !== "" || gender !== "" || province !== "" || category !== "";
  const noSource = players.length === 0;

  return (
    <div className="hub" id="pemain">
      <div className="hub-head">
        <div className="wrap hub-head-row">
          <div>
            <p className="lbl">Direktori</p>
            <h1 className="page-title">Pemain</h1>
          </div>
          <p className="hub-count">{noSource ? "Belum ada data" : `${rows.length} pemain`}</p>
        </div>
      </div>
      <div className="hub-tools">
        <div className="wrap hub-tools-row">
          <label className="search">
            <span className="sr">Cari pemain</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              type="search"
              placeholder="Cari nama, provinsi, atau kategori…"
              autoComplete="off"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <section className="filters player-filters" aria-label="Filter pemain">
            <div className="f">
              <label className="lbl" htmlFor="f-gender">Gender</label>
              <select id="f-gender" value={gender} onChange={(e) => setGender(e.target.value as GenderFilter)}>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="f">
              <label className="lbl" htmlFor="f-province">Provinsi</label>
              <select id="f-province" value={province} onChange={(e) => setProvince(e.target.value)}>
                <option value="">Semua provinsi</option>
                {options.provinces.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="f">
              <label className="lbl" htmlFor="f-category">Kategori</label>
              <select id="f-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Semua kategori</option>
                {options.categories.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </section>
        </div>
      </div>
      <main className="wrap hub-main">
        {rows.length === 0 ? (
          <div className="empty-state">
            <div className="big" aria-hidden="true">🏓</div>
            <h2>{noSource || !filtered ? "Data pemain segera hadir" : "Tidak ada pemain yang cocok"}</h2>
            <p>
              {noSource
                ? "Direktori ini masih kosong. Nama, foto, dan kontak pemain tidak ditampilkan."
                : "Coba kata kunci atau filter yang lain."}
            </p>
          </div>
        ) : (
          <ul className="player-grid">
            {rows.map((player) => (
              <li key={player.id}>
                <Link className="player-card" href={`/pemain/${encodeURIComponent(player.id)}`}>
                  <span className="player-mark" aria-hidden="true">
                    {player.name.slice(0, 1).toLocaleUpperCase("id")}
                  </span>
                  <span className="player-copy">
                    <strong>{player.name}</strong>
                    <span>{[genderLabel(player.gender), player.province, player.category].filter(Boolean).join(" · ") || "Kategori belum diisi"}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
