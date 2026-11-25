"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { URL_CHANGE_EVENT } from "@/lib/chrome";
import {
  BULAN, HARI, LIST_URL_KEY, NA, compareByStart, dayNumber, eventHref, fmtMonth, fmtRange, isPast,
  monthGrid, monthIndex, monthKey, placeLine, shiftMonth,
  type DayKey, type Tournament,
} from "@/lib/tournament";
import { useToday } from "@/lib/use-today";
import { TournamentCarousel } from "./TournamentCarousel";



type View = "list" | "cal";
type Filters = {
  q: string;
  /** "c:<city>" or "p:<province>", or "" for all. */
  loc: string;
  /** "YYYY-MM" or "". */
  month: string;
  onlyConf: boolean;
  showPast: boolean;
  view: View;
  /** Month shown by the calendar when no month filter is picked ("YYYY-MM"). */
  cal: string;
};

const EMPTY: Filters = { q: "", loc: "", month: "", onlyConf: false, showPast: false, view: "list", cal: "" };
const YM = /^\d{4}-\d{2}$/;

function readFilters(p: URLSearchParams): Filters {
  const month = p.get("bulan") ?? "";
  const cal = p.get("kal") ?? "";
  return {
    q: p.get("q") ?? "",
    loc: p.get("lokasi") ?? "",
    month: YM.test(month) ? month : "",
    onlyConf: p.get("konfirmasi") === "1",
    showPast: p.get("lewat") === "1",
    view: p.get("tampilan") === "kalender" ? "cal" : "list",
    cal: YM.test(cal) ? cal : "",
  };
}

function writeFilters(f: Filters): string {
  const p = new URLSearchParams();
  if (f.view === "cal") p.set("tampilan", "kalender");
  if (f.q) p.set("q", f.q);
  if (f.loc) p.set("lokasi", f.loc);
  if (f.month) p.set("bulan", f.month);
  if (f.onlyConf) p.set("konfirmasi", "1");
  if (f.showPast) p.set("lewat", "1");
  if (f.view === "cal" && f.cal && !f.month) p.set("kal", f.cal);
  const s = p.toString();
  return s ? `?${s}` : "";
}

type Props = { tournaments: Tournament[]; buildDay: DayKey; hasSample: boolean };

/** The list page body, with filters read from and written to the URL. */
export function TournamentBrowserWithParams(props: Props) {
  const params = useSearchParams();
  return <TournamentBrowser {...props} initial={readFilters(new URLSearchParams(params.toString()))} />;
}

/** Same body with default filters; the static HTML and Suspense fallback. */
export function TournamentBrowserStatic(props: Props) {
  return <TournamentBrowser {...props} initial={EMPTY} />;
}

function TournamentBrowser({ tournaments, buildDay, hasSample, initial }: Props & { initial: Filters }) {
  const today = useToday(buildDay);
  const [f, setF] = useState<Filters>(initial);
  const set = (patch: Partial<Filters>) => setF((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    const next = `${window.location.pathname}${writeFilters(f)}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (next !== current) {
      window.history.replaceState(null, "", next);
      window.dispatchEvent(new Event(URL_CHANGE_EVENT));
    }
    sessionStorage.setItem(LIST_URL_KEY, next);
  }, [f]);

  const options = useMemo(() => {
    const sort = (s: Set<string>) => Array.from(s).sort((a, b) => a.localeCompare(b, "id"));
    const cities = new Set<string>(), provs = new Set<string>(), months = new Set<string>();
    for (const t of tournaments) {
      if (t.city) cities.add(t.city);
      if (t.province) provs.add(t.province);
      if (t.start) months.add(monthKey(t.start));
    }
    return { cities: sort(cities), provs: sort(provs), months: Array.from(months).sort() };
  }, [tournaments]);

  const select = (ignoreMonth: boolean) => {
    const q = f.q.trim().toLowerCase();
    const month = ignoreMonth ? "" : f.month;
    let pastHidden = 0;
    const rows = tournaments
      .filter((t) => {
        if (f.loc.startsWith("c:") && t.city !== f.loc.slice(2)) return false;
        if (f.loc.startsWith("p:") && t.province !== f.loc.slice(2)) return false;
        if (month && (!t.start || monthKey(t.start) !== month)) return false;
        if (q && !t.search.includes(q)) return false;
        if (f.onlyConf && t.unconfirmed) return false;
        if (isPast(t, today) && !f.showPast) {
          pastHidden++;
          return false;
        }
        return true;
      })
      .sort(compareByStart);
    return { rows, pastHidden };
  };

  const { rows, pastHidden } = select(false);
  const nConf = rows.filter((t) => !t.unconfirmed).length;
  const reset = () => set({ q: "", loc: "", month: "", onlyConf: false });
  const noData = tournaments.length === 0;

  return (
    <>
      <div className="hub" id="jadwal">
        <div className="hub-head">
          <div className="wrap hub-head-row">
            <div>
              <p className="lbl">Jadwal</p>
              <h2 className="page-title">Turnamen</h2>
            </div>
            <div className="seg" role="group" aria-label="Tampilan">
              <button type="button" aria-pressed={f.view === "list"} onClick={() => set({ view: "list" })}>
                Daftar
              </button>
              <button type="button" aria-pressed={f.view === "cal"} onClick={() => set({ view: "cal" })}>
                Kalender
              </button>
            </div>
          </div>
        </div>
        <div className="hub-tools">
          <div className="wrap hub-tools-row">
            <label className="search">
              <span className="sr">Cari turnamen</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <input
                type="search"
                placeholder="Cari nama turnamen, venue, kategori, panitia…"
                autoComplete="off"
                value={f.q}
                onChange={(e) => set({ q: e.target.value })}
              />
            </label>
            <section className="filters" aria-label="Filter">
              <div className="f">
                <label className="lbl" htmlFor="f-loc">Kota / Provinsi</label>
                <select id="f-loc" value={f.loc} onChange={(e) => set({ loc: e.target.value })}>
                  <option value="">Semua kota &amp; provinsi</option>
                  {options.cities.length > 0 && (
                    <optgroup label="Kota">
                      {options.cities.map((c) => <option key={c} value={`c:${c}`}>{c}</option>)}
                    </optgroup>
                  )}
                  {options.provs.length > 0 && (
                    <optgroup label="Provinsi">
                      {options.provs.map((p) => <option key={p} value={`p:${p}`}>{p}</option>)}
                    </optgroup>
                  )}
                </select>
              </div>
              <div className="f">
                <label className="lbl" htmlFor="f-month">Bulan</label>
                <select id="f-month" value={f.month} onChange={(e) => set({ month: e.target.value })}>
                  <option value="">Semua bulan</option>
                  {options.months.map((m) => <option key={m} value={m}>{fmtMonth(m)}</option>)}
                </select>
              </div>
              <div className="toggles">
                <label className="toggle">
                  <input type="checkbox" checked={f.onlyConf} onChange={(e) => set({ onlyConf: e.target.checked })} />{" "}
                  Hanya yang terkonfirmasi
                </label>
                <label className="toggle">
                  <input type="checkbox" checked={f.showPast} onChange={(e) => set({ showPast: e.target.checked })} />{" "}
                  Tampilkan yang sudah lewat
                </label>
              </div>
            </section>
            <FilterChips f={f} set={set} />
          </div>
        </div>

      <main className="wrap hub-main">
        <div className="intro">
          <p>
            Jadwal turnamen tenis meja (ping pong) di seluruh Indonesia. Selalu cek ulang detail ke panitia lewat
            tautan sumber.
          </p>
        </div>

        {hasSample && (
          <div className="banner" role="note">
            <span>🧪</span>
            <div>
              <b>Contoh data / sample.</b> Sebagian entri di bawah ini hanya contoh untuk pratinjau tampilan, bukan
              turnamen sungguhan.
            </div>
          </div>
        )}

        <div className="meta">
          <span className="count" aria-live="polite">
            {noData ? "" : `${rows.length} turnamen · ${nConf} terkonfirmasi`}
          </span>
          <span>{!noData && pastHidden ? `${pastHidden} sudah lewat disembunyikan` : ""}</span>
        </div>

        {noData ? (
          <div className="list">
            <div className="empty-state">
              <div className="big">🏓</div>
              <h3>Belum ada turnamen</h3>
              <p>Data turnamen sedang dikumpulkan. Cek lagi nanti, ya!</p>
            </div>
          </div>
        ) : f.view === "cal" ? (
          <CalendarView
            rows={f.month ? rows : select(true).rows}
            month={f.month}
            cal={f.cal}
            today={today}
            onMonth={(m) => set({ cal: m, month: "" })}
          />
        ) : rows.length === 0 ? (
          <div className="list">
            <EmptyResult pastHidden={pastHidden} onReset={reset} />
          </div>
        ) : (
          <TournamentCarousel items={rows} today={today} />
        )}
      </main>
      </div>
    </>
  );
}

function EmptyResult({ pastHidden, onReset }: { pastHidden: number; onReset: () => void }) {
  return (
    <div className="empty-state">
      <div className="big">🔍</div>
      <h3>Tidak ada yang cocok</h3>
      <p>Coba ubah kata kunci atau filter{pastHidden ? ", atau tampilkan turnamen yang sudah lewat" : ""}.</p>
      <button className="btn btn-hot" type="button" onClick={onReset}>
        Reset filter
      </button>
    </div>
  );
}

function FilterChips({ f, set }: { f: Filters; set: (patch: Partial<Filters>) => void }) {
  const chips: { key: string; label: string; clear: Partial<Filters> }[] = [];
  if (f.q) chips.push({ key: "q", label: `Cari: ${f.q}`, clear: { q: "" } });
  if (f.loc.startsWith("c:")) chips.push({ key: "loc", label: `Kota: ${f.loc.slice(2)}`, clear: { loc: "" } });
  else if (f.loc.startsWith("p:")) chips.push({ key: "loc", label: `Provinsi: ${f.loc.slice(2)}`, clear: { loc: "" } });
  if (f.month) chips.push({ key: "month", label: fmtMonth(f.month), clear: { month: "" } });
  if (f.onlyConf) chips.push({ key: "conf", label: "Hanya yang terkonfirmasi", clear: { onlyConf: false } });
  if (f.showPast) chips.push({ key: "past", label: "Termasuk yang sudah lewat", clear: { showPast: false } });
  if (!chips.length) return null;
  return (
    <div className="fchips" aria-label="Filter aktif">
      {chips.map((chip) => (
        <button key={chip.key} type="button" onClick={() => set(chip.clear)}>
          <span>{chip.label}</span>
          <span aria-hidden="true">×</span>
          <span className="sr">Hapus filter</span>
        </button>
      ))}
    </div>
  );
}

type CalendarProps = {
  /** Rows after all filters; the month filter is already applied only when one is picked. */
  rows: Tournament[];
  month: string;
  cal: string;
  today: DayKey;
  onMonth: (month: string) => void;
};

function CalendarView({ rows, month, cal, today, onMonth }: CalendarProps) {
  // Month to show: the picked month, else the one browsed to, else the month of the next event.
  let shown = month || cal;
  if (!shown) {
    const next = rows.find((t) => t.last && t.last >= today);
    shown = monthKey(next?.start && next.start > today ? next.start : today);
  }
  const { days, first, last } = monthGrid(shown);
  const dated = rows.filter((t) => t.start);
  const on = (d: DayKey) => dated.filter((t) => d >= t.start! && d <= (t.last ?? t.start!));
  const inMonth = dated.filter((t) => t.start! <= last && (t.last ?? t.start!) >= first);
  const undated = rows.length - dated.length;
  const title = fmtMonth(shown);

  return (
    <div className="cal-layout">
      <section className="cal" aria-label="Kalender turnamen">
        <div className="cal-head">
          <button type="button" className="navbtn" aria-label="Bulan sebelumnya" onClick={() => onMonth(shiftMonth(shown, -1))}>
            ‹
          </button>
          <h2>{title}</h2>
          <button type="button" className="navbtn" aria-label="Bulan berikutnya" onClick={() => onMonth(shiftMonth(shown, 1))}>
            ›
          </button>
        </div>
        <div className="cal-grid">
          {HARI.map((h) => <div className="cal-dow" key={h}>{h}</div>)}
          {days.map((d) => (
            <div
              key={d}
              className={`cal-day${monthKey(d) !== shown ? " out" : ""}${d === today ? " today" : ""}`}
            >
              <span className="n">{dayNumber(d)}</span>
              {on(d).map((t) => (
                <Link key={t.id} className={`cal-ev${t.unconfirmed ? " unconf" : ""}`} href={eventHref(t)} title={t.name}>
                  {t.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="legend">
          <span>Terkonfirmasi</span>
          <span className="u">Belum dikonfirmasi</span>
        </div>
      </section>
      <div className="cal-side">
      <h2 className="group-h">
        Agenda {title} ({inMonth.length})
      </h2>
      <div className="agenda">
        {inMonth.length ? (
          inMonth.map((t) => (
            <Link className="ag" href={eventHref(t)} key={t.id}>
              <div className="d">
                <b>{dayNumber(t.start!)}</b>
                <span>{BULAN[monthIndex(t.start!)]}</span>
              </div>
              <div>
                <h3>{t.name}</h3>
                <p>
                  {fmtRange(t.start, t.end)} · {placeLine(t) || `Lokasi ${NA.toLowerCase()}`}
                  {t.unconfirmed ? " · ⚠ Belum dikonfirmasi" : ""}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="na">Tidak ada turnamen di bulan ini dengan filter saat ini.</p>
        )}
        {undated > 0 && <p className="found">{undated} turnamen tanpa tanggal hanya muncul di tampilan Daftar.</p>}
      </div>
      </div>
    </div>
  );
}
