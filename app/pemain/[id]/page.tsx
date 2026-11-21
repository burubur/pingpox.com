import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPlayerName, regionLine } from "@/domain/players";
import { getPlayer, playerMatchHistory } from "@/lib/queries/players";
import { ageFromBirthYear } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const player = await getPlayer(params.id);
  if (!player) return { title: "Pemain tidak ditemukan" };
  return { title: formatPlayerName(player.name) };
}

export default async function PemainDetailPage({ params }: { params: { id: string } }) {
  const player = await getPlayer(params.id);
  if (!player) notFound();
  const history = await playerMatchHistory(params.id);
  const played = history.filter((h) => h.result !== "pending").length;
  const wins = history.filter((h) => h.result === "win").length;

  return (
    <>
      <div className="backbar">
        <div className="wrap">
          <Link href="/pemain">‹ Kembali ke pemain</Link>
        </div>
      </div>
      <section className="hero">
        <div className="band g1">
          <div
            className="wrap"
            style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}
          >
            <h1>{formatPlayerName(player.name)}</h1>
            <p className="place">
              Peringkat #{player.ranking} · {player.gender === "men" ? "Putra" : "Putri"} · Usia{" "}
              {ageFromBirthYear(player.birthYear)}
            </p>
            <p className="place">{regionLine(player, "postalCode")}</p>
          </div>
        </div>
      </section>
      <div className="wrap sec">
        <h2>Profil</h2>
        <dl className="kv">
          <div>
            <dt>Klub</dt>
            <dd>{player.club ?? "—"}</dd>
          </div>
          <div>
            <dt>Provinsi</dt>
            <dd>{player.province}</dd>
          </div>
          <div>
            <dt>Kota</dt>
            <dd>{player.city}</dd>
          </div>
          <div>
            <dt>Rekor</dt>
            <dd>
              Main: {played} · Menang: {wins}
            </dd>
          </div>
        </dl>
      </div>
      <div className="wrap sec detail-end">
        <h2>Pertandingan terakhir</h2>
        {history.length === 0 ? (
          <p className="meta">Belum ada data pertandingan.</p>
        ) : (
          <ul className="agenda">
            {history.map((h, i) => (
              <li key={`${h.event_id}-${i}`} className="ag" style={{ listStyle: "none" }}>
                <div>
                  <h3>{h.event_title}</h3>
                  <p>
                    {h.stage} · vs {h.opponent} · {h.score} ·{" "}
                    {h.result === "win" ? "Menang" : h.result === "loss" ? "Kalah" : "Menunggu"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
