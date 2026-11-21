import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentAccount } from "@/lib/auth";
import { getPrices, listCatalogTopics, listOyudaSessions } from "@/lib/queries/training";
import { EnrollForm } from "@/features/training/EnrollForm";

export const metadata: Metadata = { title: "Latihan" };
export const dynamic = "force-dynamic";

export default async function LatihanPage() {
  const account = await getCurrentAccount();
  const [prices, sessions, topics] = await Promise.all([
    getPrices(),
    listOyudaSessions(),
    listCatalogTopics(),
  ]);

  return (
    <>
      <div className="subbar">
        <div className="wrap">
          <h1>Latihan</h1>
          <div className="actions" style={{ marginLeft: "auto" }}>
            {account ? (
              <>
                <Link href="/latihan/saya" className="btn btn-light">
                  Latihan saya
                </Link>
                <Link href="/latihan/meja" className="btn btn-light">
                  Meja pelatih
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="wrap list">
        <div className="ev">
          <div className="band g2">
            <div>
              <h2>Bulanan</h2>
              <p className="place">Rp {prices.monthly.toLocaleString("id-ID")}</p>
              <p className="place" style={{ fontSize: 15 }}>
                Akses program latihan berkelanjutan.
              </p>
            </div>
          </div>
        </div>
        <div className="ev">
          <div className="band g3">
            <div>
              <h2>Satu kali</h2>
              <p className="place">Rp {prices.oneTime.toLocaleString("id-ID")}</p>
              <p className="place" style={{ fontSize: 15 }}>
                Paket sesi terbatas tanpa perpanjangan otomatis.
              </p>
            </div>
          </div>
        </div>
        <EnrollForm signedIn={Boolean(account)} />
        <section className="sec">
          <h2>Oyuda · sesi</h2>
          <ol className="agenda">
            {sessions.map((s) => (
              <li key={s.order} className="ag" style={{ listStyle: "none" }}>
                <div>
                  <h3>
                    Sesi {s.order} · {s.durationHours} jam
                  </h3>
                  <p>{s.drills.join("; ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="sec">
          <h2>Topik katalog</h2>
          <div className="chipsrow">
            {topics.map((t) => (
              <span key={t.id} className="badge b-conf">
                {t.title}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
