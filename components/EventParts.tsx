// Presentational pieces shared by the list cards and the detail page.
// They take `today` as a prop, so they render the same on the server and the client.
import {
  NA, fmtDay, fmtRange, daysBetween, isLive, isPast, placeLine,
  type DayKey, type Tournament,
} from "@/lib/tournament";
import Countdown from "./Countdown";

/** An optional text value, or the "Belum diumumkan" placeholder. */
export function Val({ v }: { v: string | null }) {
  return v === null ? <span className="na">{NA}</span> : <>{v}</>;
}

export function EventDate({ t }: { t: Tournament }) {
  return (
    <div className="when">
      {t.start ? (
        <span className="date">📅 {fmtRange(t.start, t.end)}</span>
      ) : (
        <span className="date nodate">📅 Tanggal belum diumumkan</span>
      )}
    </div>
  );
}

export function Place({ t }: { t: Tournament }) {
  const loc = placeLine(t);
  return (
    <p className="place">
      {t.venue && (
        <>
          {t.venue}
          <br />
        </>
      )}
      {loc || <span className="na">Lokasi {NA.toLowerCase()}</span>}
    </p>
  );
}

export function Badges({ t, today }: { t: Tournament; today: DayKey }) {
  return (
    <div className="chipsrow">
      {isLive(t, today) && <span className="badge b-live">● Sedang berlangsung</span>}
      {t.sample && <span className="badge b-sample">Contoh data / sample</span>}
      {t.unconfirmed ? (
        <span className="badge b-unconf">⚠ Belum dikonfirmasi</span>
      ) : (
        <span className="badge b-conf">✓ Terkonfirmasi</span>
      )}
      {isPast(t, today) && <span className="badge b-past">Sudah lewat</span>}
    </div>
  );
}

export function Deadline({ t, today }: { t: Tournament; today: DayKey }) {
  if (!t.deadline) return <Val v={t.deadlineText} />;
  const d = daysBetween(today, t.deadline);
  return (
    <>
      {fmtDay(t.deadline)}
      {d < 0 ? (
        <span className="flag closed">Pendaftaran ditutup</span>
      ) : d === 0 ? (
        <span className="flag soon">Hari ini terakhir</span>
      ) : d <= 7 ? (
        <span className="flag soon">{d} hari lagi</span>
      ) : null}
    </>
  );
}

/** Countdown (for events that have not started) plus the category badge grid. */
export function Side({ t, today }: { t: Tournament; today: DayKey }) {
  return (
    <div className="side">
      {t.start && t.start > today && <Countdown start={t.start} />}
      {t.categories.length ? (
        <div className="divs" aria-label="Kategori / divisi">
          {t.categories.map((c, i) => (
            <div className="div" key={i}>
              <span>{c}</span>
              <i aria-hidden="true">{i + 1}</i>
            </div>
          ))}
        </div>
      ) : (
        <div className="divs empty">
          <div className="div">Kategori: {NA}</div>
        </div>
      )}
    </div>
  );
}
