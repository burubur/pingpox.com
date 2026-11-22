"use client";

import { CALENDAR_HREF, featuredEvent, LIST_HREF, type ChromeEvent } from "@/lib/chrome";
import { useToday } from "@/lib/use-today";
import type { DayKey } from "@/lib/tournament";

type Feature = { event: ChromeEvent; kind: "next" | "live" };

export function HomeHero({ events, buildDay, total }: { events: ChromeEvent[]; buildDay: DayKey; total: number }) {
  const today = useToday(buildDay);
  const feature = featuredEvent(events, today);
  return (
    <section className="home-hero" aria-label="Pengantar">
      <div className="home-hero-bg">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="wrap home-hero-grid">
          <div>
            <p className="lbl">PingpoX</p>
            <h1>Jadwal turnamen tenis meja Indonesia</h1>
            <p className="lead">
              Daftar dan kalender turnamen tenis meja di seluruh Indonesia, dikumpulkan dari sumber publik. Cek tanggal,
              kota, dan tautan panitia sebelum mendaftar.
            </p>
            <p className="hero-count">
              {total === 0 ? "Belum ada turnamen tercatat" : `${total} turnamen tercatat`}
            </p>
            <div className="actions">
              <a className="btn btn-light" href={LIST_HREF}>
                Lihat jadwal
              </a>
              <a className="btn btn-ghost" href={CALENDAR_HREF}>
                Lihat kalender
              </a>
            </div>
          </div>
          {feature && <FeatureCard feature={feature} />}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const { event, kind } = feature;
  return (
    <a className={`hero-card g${event.tone}`} href={event.href}>
      <span className="lbl">{kind === "live" ? "Sedang berlangsung" : "Berikutnya"}</span>
      <strong>{event.name}</strong>
      <span>{event.when}</span>
      <span>{event.place}</span>
      {event.unconfirmed ? (
        <span className="badge b-unconf">Belum dikonfirmasi</span>
      ) : (
        <span className="badge b-conf">Terkonfirmasi</span>
      )}
      <span className="mega-go">Info turnamen</span>
    </a>
  );
}
