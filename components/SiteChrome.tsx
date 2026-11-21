import Link from "next/link";
import { getCurrentAccount } from "@/lib/auth";
import { PlatformNav } from "@/components/PlatformNav";

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

export async function SiteHeader({ updated }: { updated: string | null }) {
  const account = await getCurrentAccount();
  return (
    <header className="nav">
      <div className="wrap">
        <Link className="logo" href="/" aria-label="Beranda Jadwal Turnamen Tenis Meja">
          <Logo />
        </Link>
        <PlatformNav
          signedIn={Boolean(account)}
          displayName={account?.displayName}
        />
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
          Data turnamen dari <code>tournaments.json</code>, dikumpulkan dari sumber publik. Fitur platform
          PingpoX (pemain, latihan, evaluasi) memakai basis data lokal atau Postgres saat{" "}
          <code>DATABASE_URL</code> disetel.
        </p>
        {updated && <p>Terakhir diperbarui: {updated}</p>}
      </div>
    </footer>
  );
}