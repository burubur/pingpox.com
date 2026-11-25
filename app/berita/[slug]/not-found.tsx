import Link from "next/link";

export default function NewsNotFound() {
  return (
    <>
      <div className="backbar">
        <div className="wrap">
          <Link href="/berita">‹ Daftar berita</Link>
        </div>
      </div>
      <main className="wrap detail-end">
        <div className="empty-state">
          <div className="big" aria-hidden="true">🏓</div>
          <h2>Berita tidak ditemukan</h2>
          <p>Entri ini belum ada. Daftar berita masih kosong.</p>
          <Link className="btn btn-hot" href="/berita">
            Lihat daftar berita
          </Link>
        </div>
      </main>
    </>
  );
}
