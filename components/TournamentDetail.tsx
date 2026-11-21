"use client";

import { useState } from "react";
import { NA, fmtDay, fmtRange, safeUrl, type DayKey, type Tournament } from "@/lib/tournament";
import { useToday } from "@/lib/use-today";
import { Badges, Deadline, EventDate, Place, Side, Val } from "./EventParts";

const SECTIONS = [
  ["sec-ov", "Ikhtisar"],
  ["sec-dv", "Divisi"],
  ["sec-rg", "Pendaftaran"],
  ["sec-sr", "Sumber"],
] as const;

export default function TournamentDetail({ t, buildDay }: { t: Tournament; buildDay: DayKey }) {
  const today = useToday(buildDay);
  const [active, setActive] = useState<string>(SECTIONS[0][0]);
  const go = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="hero">
        <div className={`band g${t.tone}`}>
          <div>
            <EventDate t={t} />
            <h1>{t.name}</h1>
            <Place t={t} />
            <Badges t={t} today={today} />
          </div>
          <Side t={t} today={today} />
        </div>
      </section>
      <nav className="tabs" aria-label="Bagian">
        <div className="wrap">
          {SECTIONS.map(([id, label]) => (
            <button key={id} type="button" className={active === id ? "on" : undefined} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </div>
      </nav>
      <main className="wrap detail-end">
        <section className="sec" id="sec-ov">
          <h2>Ikhtisar</h2>
          <dl className="kv">
            <div>
              <dt>Tanggal</dt>
              <dd>{t.start ? fmtRange(t.start, t.end) : <span className="na">{NA}</span>}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{t.unconfirmed ? "⚠ Belum dikonfirmasi" : "✓ Terkonfirmasi"}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd><Val v={t.venue} /></dd>
            </div>
            <div>
              <dt>Kota</dt>
              <dd><Val v={t.city || null} /></dd>
            </div>
            <div>
              <dt>Provinsi</dt>
              <dd><Val v={t.province || null} /></dd>
            </div>
            <div>
              <dt>Penyelenggara</dt>
              <dd><Val v={t.organizer} /></dd>
            </div>
          </dl>
          {t.notes && <p className="notes">{t.notes}</p>}
        </section>

        <section className="sec" id="sec-dv">
          <h2>Divisi</h2>
          {t.categories.length ? (
            <div className="dgrid">
              {t.categories.map((c, i) => (
                <div className="dtile" key={i}>
                  <i aria-hidden="true">{i + 1}</i>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="na">Kategori: {NA}</p>
          )}
        </section>

        <section className="sec" id="sec-rg">
          <h2>Pendaftaran</h2>
          <dl className="kv">
            <div>
              <dt>Biaya pendaftaran</dt>
              <dd><Val v={t.fee} /></dd>
            </div>
            <div>
              <dt>Batas pendaftaran</dt>
              <dd><Deadline t={t} today={today} /></dd>
            </div>
            <div>
              <dt>Kontak</dt>
              <dd><Val v={t.contact} /></dd>
            </div>
          </dl>
        </section>

        <section className="sec" id="sec-sr">
          <h2>Sumber</h2>
          {t.sources.length ? (
            <div className="sources">
              {t.sources.map((u, i) => {
                const label = t.sources.length > 1 ? `Sumber ${i + 1}` : "Sumber";
                const href = safeUrl(u);
                return href ? (
                  <a key={i} className="src" href={href} target="_blank" rel="noopener noreferrer">
                    {label} <span aria-hidden="true">↗</span>
                    <span className="sr"> (tab baru)</span>
                  </a>
                ) : (
                  <span key={i} className="src text" title="Sumber non-web">
                    {label}: {u}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="na">{NA}</p>
          )}
          {t.dateFound && <div className="found">Ditemukan {fmtDay(t.dateFound)}</div>}
        </section>
      </main>
    </>
  );
}
