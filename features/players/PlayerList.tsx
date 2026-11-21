"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart, Search } from "lucide-react";
import {
  filterAndRankPlayers,
  formatPlayerName,
  regionLine,
  type PlayerRecord,
} from "@/domain/players";
import regions from "@/data/regions.json";
import { ageFromBirthYear } from "@/lib/utils";

export function PlayerList({ players }: { players: PlayerRecord[] }) {
  const [gender, setGender] = useState<"men" | "women">("men");
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [saved, setSaved] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("pingpox-favs") ?? "[]") as string[];
    } catch {
      return [];
    }
  });

  const cities = regions.provinces.find((p) => p.name === province)?.cities ?? [];
  const districts = cities.find((c) => c.name === city)?.districts ?? [];
  const subdistricts = districts.find((d) => d.name === district)?.subdistricts ?? [];

  const ranked = useMemo(
    () =>
      filterAndRankPlayers(players, {
        gender,
        search,
        province: province || undefined,
        city: city || undefined,
        district: district || undefined,
        subdistrict: subdistrict || undefined,
        postalCode: postalCode || undefined,
      }),
    [players, gender, search, province, city, district, subdistrict, postalCode],
  );

  const detail =
    postalCode
      ? "postalCode"
      : subdistrict
        ? "subdistrict"
        : district
          ? "district"
          : undefined;

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("pingpox-favs", JSON.stringify(next));
      return next;
    });
  }

  return (
    <>
      <div className="wrap intro">
        <p>
          Daftar pemain terdaftar di PingpoX. Filter menurut wilayah atau cari nama. Peringkat dihitung dalam
          kelompok gender yang dipilih.
        </p>
      </div>

      <div className="wrap filters">
        <div className="f" style={{ gridColumn: "1 / -1" }}>
          <label className="lbl" htmlFor="cari-pemain">
            Cari
          </label>
          <div className="search" style={{ position: "relative" }}>
            <Search
              aria-hidden
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9aa0ae",
              }}
            />
            <input
              id="cari-pemain"
              type="search"
              placeholder="Cari nama pemain…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                font: "inherit",
                fontSize: 15,
                border: "1px solid #cfd3dc",
                borderRadius: 999,
                padding: "10px 16px 10px 40px",
                minHeight: 44,
              }}
            />
          </div>
        </div>
        <div className="toggles">
          <div className="seg" role="group" aria-label="Gender">
            <button type="button" aria-pressed={gender === "men"} onClick={() => setGender("men")}>
              Putra
            </button>
            <button type="button" aria-pressed={gender === "women"} onClick={() => setGender("women")}>
              Putri
            </button>
          </div>
        </div>
        <select
          value={province}
          aria-label="Provinsi"
          onChange={(e) => {
            setProvince(e.target.value);
            setCity("");
            setDistrict("");
            setSubdistrict("");
            setPostalCode("");
          }}
        >
          <option value="">Provinsi</option>
          {regions.provinces.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={city}
          aria-label="Kota"
          onChange={(e) => {
            setCity(e.target.value);
            setDistrict("");
            setSubdistrict("");
            setPostalCode("");
          }}
        >
          <option value="">Kota/Kabupaten</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={district}
          aria-label="Kecamatan"
          onChange={(e) => {
            setDistrict(e.target.value);
            setSubdistrict("");
            setPostalCode("");
          }}
        >
          <option value="">Kecamatan</option>
          {districts.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          value={subdistrict}
          aria-label="Kelurahan"
          onChange={(e) => {
            setSubdistrict(e.target.value);
            const codes =
              subdistricts.find((s) => s.name === e.target.value)?.postalCodes ?? [];
            setPostalCode(codes[0] ?? "");
          }}
        >
          <option value="">Kelurahan</option>
          {subdistricts.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={postalCode}
          aria-label="Kode pos"
          onChange={(e) => setPostalCode(e.target.value)}
        >
          <option value="">Kode pos</option>
          {(subdistricts.find((s) => s.name === subdistrict)?.postalCodes ?? []).map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <div className="wrap meta">
        <span className="count">{ranked.length} pemain</span>
      </div>

      <div className="wrap list">
        {ranked.length === 0 ? (
          <div className="empty-state">
            <p className="big">🏓</p>
            <h3>Tidak ada pemain</h3>
            <p>Ubah filter atau kata kunci pencarian.</p>
          </div>
        ) : (
          <div className="agenda">
            {ranked.map((p) => (
              <Link key={p.id} href={`/pemain/${p.id}`} className="ag">
                <div className="d">
                  <b>{p.listIndex}</b>
                  <span>#{p.ranking}</span>
                </div>
                <div>
                  <h3>{formatPlayerName(p.name)}</h3>
                  <p>
                    {regionLine(p, detail)} · {p.gender === "men" ? "Putra" : "Putri"} · Usia{" "}
                    {ageFromBirthYear(p.birthYear)}
                    {p.club ? ` · ${p.club}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Simpan ke favorit"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSave(p.id);
                  }}
                >
                  <Heart
                    size={18}
                    fill={saved.includes(p.id) ? "var(--hot2)" : "none"}
                    color={saved.includes(p.id) ? "var(--hot2)" : "var(--muted)"}
                  />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}