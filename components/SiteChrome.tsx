import Link from "next/link";

function Logo() {
  return (
    <>
      <span className="mark" aria-hidden="true" />
      <span>
        Tenis Meja<small>Indonesia</small>
      </span>
    </>
  );
}

export function SiteHeader({ updated }: { updated: string | null }) {
  return (
    <header className="nav">
      <div className="wrap">
        <Link className="logo" href="/" aria-label="Beranda Jadwal Turnamen Tenis Meja">
          <Logo />
        </Link>
        <nav className="navlinks" aria-label="Utama">
          <Link href="/" className="on">Turnamen</Link>
          <a href="#tentang">Tentang data</a>
        </nav>
        <div className="upd">{updated ? `Diperbarui ${updated}` : "Terakhir diperbarui: —"}</div>
      </div>
    </header>
  );
}

export function SiteFooter({ updated }: { updated: string | null }) {
  return (
    <footer id="tentang">
      <div className="wrap">
        <span className="logo">
          <Logo />
        </span>
        <p>
          Data dari <code>tournaments.json</code>, dikumpulkan dari sumber publik. Info bisa berubah; konfirmasi ke
          panitia sebelum mendaftar.
        </p>
        {updated && <p>Terakhir diperbarui: {updated}</p>}
      </div>
    </footer>
  );
}
