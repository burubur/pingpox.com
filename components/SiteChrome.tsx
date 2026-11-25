"use client";

import { CALENDAR_HREF, isChromeLive, LIST_HREF, upcomingChrome, type ChromeEvent } from "@/lib/chrome";
import { useToday } from "@/lib/use-today";
import type { DayKey } from "@/lib/tournament";
import { Logo } from "./Logo";

export function SiteFooter({
  updated,
  events,
  buildDay,
}: {
  updated: string | null;
  events: ChromeEvent[];
  buildDay: DayKey;
}) {
  const today = useToday(buildDay);
  const upcoming = upcomingChrome(events, today).slice(0, 4);
  return (
    <footer id="tentang">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a className="logo" href="/">
              <Logo />
            </a>
            <p>Jadwal turnamen tenis meja di Indonesia, dikumpulkan dari sumber publik.</p>
          </div>
          <div className="foot-col">
            <h2>Turnamen</h2>
            <ul>
              <li>
                <a href={LIST_HREF}>Daftar</a>
              </li>
              <li>
                <a href={CALENDAR_HREF}>Kalender</a>
              </li>
            </ul>
            <h2>Pemain</h2>
            <ul>
              <li>
                <a href="/pemain">Direktori</a>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h2>Mendatang</h2>
            {upcoming.length === 0 ? (
              <p>Belum ada turnamen mendatang di jadwal ini.</p>
            ) : (
              <ul>
                {upcoming.map((event) => (
                  <li key={event.href}>
                    <a href={event.href}>
                      {event.name}
                      <small>
                        {event.when}
                        {isChromeLive(event, today) ? " · berlangsung" : ""}
                      </small>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="foot-col">
            <h2>Data</h2>
            <p>
              Data dari <code>tournaments.json</code>, dikumpulkan dari sumber publik. Info bisa berubah; konfirmasi ke
              panitia sebelum mendaftar.
            </p>
            <p>{updated ? `Terakhir diperbarui: ${updated}` : "Terakhir diperbarui: —"}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
