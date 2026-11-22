import type { ChromeEvent } from "@/lib/chrome";
import { Logo } from "./Logo";

export function SiteFooter({ updated, events }: { updated: string | null; events: ChromeEvent[] }) {
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
                <a href="/#jadwal">Daftar</a>
              </li>
              <li>
                <a href="/?tampilan=kalender">Kalender</a>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h2>Mendatang</h2>
            {events.length === 0 ? (
              <p>Belum ada turnamen mendatang di jadwal ini.</p>
            ) : (
              <ul>
                {events.map((event) => (
                  <li key={event.href}>
                    <a href={event.href}>
                      {event.name}
                      <small>
                        {event.when}
                        {event.live ? " · berlangsung" : ""}
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
