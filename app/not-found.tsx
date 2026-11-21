import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="backbar">
        <div className="wrap">
          <Link href="/">‹ Kembali</Link>
        </div>
      </div>
      <main className="wrap detail-end">
        <div className="empty-state">
          <div className="big">🏓</div>
          <h3>Turnamen tidak ditemukan</h3>
          <p>Mungkin sudah dihapus dari daftar.</p>
          <Link className="btn btn-hot" href="/">
            Lihat semua turnamen
          </Link>
        </div>
      </main>
    </>
  );
}
