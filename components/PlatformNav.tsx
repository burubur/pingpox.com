"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function PlatformNav({
  signedIn,
  displayName,
}: {
  signedIn: boolean;
  displayName?: string;
}) {
  const path = usePathname();
  const router = useRouter();

  function active(href: string) {
    if (href === "/") return path === "/" ? "on" : undefined;
    return path === href || path.startsWith(`${href}/`) ? "on" : undefined;
  }

  return (
    <nav className="navlinks" aria-label="Utama">
      <Link href="/" className={active("/")}>
        Turnamen
      </Link>
      <Link href="/pemain" className={active("/pemain")}>
        Pemain
      </Link>
      <Link href="/latihan" className={active("/latihan")}>
        Latihan
      </Link>
      {signedIn ? (
        <button
          type="button"
          className="nav-auth"
          onClick={async () => {
            await fetch("/api/auth/sign-out", { method: "POST" });
            router.refresh();
            router.push("/");
          }}
        >
          Keluar{displayName ? ` (${displayName})` : ""}
        </button>
      ) : (
        <>
          <Link href="/masuk" className={active("/masuk")}>
            Masuk
          </Link>
          <Link href="/daftar" className={active("/daftar")}>
            Daftar
          </Link>
        </>
      )}
      <a href="#tentang">Tentang data</a>
    </nav>
  );
}