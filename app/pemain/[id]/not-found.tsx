import Link from "next/link";

export default function PlayerNotFound() {
  return (
    <>
      <div className="backbar">
        <div className="wrap">
          <Link href="/pemain">‹ Direktori pemain</Link>
        </div>
      </div>
      <main className="wrap detail-end">
        <div className="empty-state">
          <div className="big" aria-hidden="true">🏓</div>
          <h2>Pemain tidak ditemukan</h2>
          <p>Data pemain segera hadir. Entri ini belum ada di direktori.</p>
          <Link className="btn btn-hot" href="/pemain">
            Lihat direktori pemain
          </Link>
        </div>
      </main>
    </>
  );
}
