"use client";

import { useLayoutEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { NA, fmtDay, fmtRange, safeUrl, type DayKey, type Tournament } from "@/lib/tournament";
import { useToday } from "@/lib/use-today";
import { Badges, Deadline, EventDate, Place, Side, Val } from "./EventParts";

const TABS = [
  { id: "ikhtisar", label: "Ikhtisar" },
  { id: "bagan", label: "Bagan" },
  { id: "hasil", label: "Hasil" },
  { id: "info", label: "Info" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function tabFromHash(): TabId {
  const id = window.location.hash.slice(1);
  return TABS.some((tab) => tab.id === id) ? (id as TabId) : "ikhtisar";
}

export default function TournamentDetail({ t, buildDay }: { t: Tournament; buildDay: DayKey }) {
  const today = useToday(buildDay);
  const [active, setActive] = useState<TabId>("ikhtisar");
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const sync = () => setActive(tabFromHash());
    sync();
    setReady(true);
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const selectTab = (id: TabId, push: boolean) => {
    const next = `#${id}`;
    if (window.location.hash === next) return;
    const url = `${window.location.pathname}${window.location.search}${next}`;
    if (push) window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  const onTabKey = (e: ReactKeyboardEvent<HTMLAnchorElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    const id = TABS[next].id;
    const el = document.getElementById(`tab-${id}`);
    if (el instanceof HTMLAnchorElement) el.focus();
    selectTab(id, false);
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
      <div className={`event-shell${ready ? " tabs-ready" : ""}`}>
        <nav className="tabs" role="tablist" aria-label="Bagian turnamen">
          <div className="wrap">
            {TABS.map((tab, index) => (
              <a
                key={tab.id}
                id={`tab-${tab.id}`}
                href={`#${tab.id}`}
                role="tab"
                className={ready && active === tab.id ? "on" : undefined}
                aria-selected={active === tab.id}
                aria-controls={tab.id}
                tabIndex={active === tab.id ? 0 : -1}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  selectTab(tab.id, true);
                }}
                onKeyDown={(e) => onTabKey(e, index)}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </nav>
        <div className="event-panels wrap detail-end">
          <section className={`event-panel sec${ready && active === "ikhtisar" ? " is-on" : ""}`} id="ikhtisar" role="tabpanel" aria-labelledby="tab-ikhtisar">
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
            <h2 className="sec-sub">Kategori</h2>
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

          <section className={`event-panel sec${ready && active === "bagan" ? " is-on" : ""}`} id="bagan" role="tabpanel" aria-labelledby="tab-bagan">
            <h2>Bagan</h2>
            <EmptyTab>
              Bagan pertandingan untuk turnamen ini belum dipublikasikan.
            </EmptyTab>
          </section>

          <section className={`event-panel sec${ready && active === "hasil" ? " is-on" : ""}`} id="hasil" role="tabpanel" aria-labelledby="tab-hasil">
            <h2>Hasil</h2>
            <EmptyTab>
              Hasil pertandingan untuk turnamen ini belum dipublikasikan.
            </EmptyTab>
          </section>

          <section className={`event-panel sec${ready && active === "info" ? " is-on" : ""}`} id="info" role="tabpanel" aria-labelledby="tab-info">
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
            <h2 className="sec-sub">Sumber</h2>
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
        </div>
      </div>
    </>
  );
}

function EmptyTab({ children }: { children: string }) {
  return (
    <div className="empty-state">
      <h3>Belum tersedia</h3>
      <p>{children}</p>
    </div>
  );
}
