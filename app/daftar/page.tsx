"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DaftarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });
      if (!res.ok) {
        setError((await res.json()).error ?? "Gagal mendaftar");
        return;
      }
      router.push("/latihan");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="subbar">
        <div className="wrap">
          <h1>Daftar</h1>
        </div>
      </div>
      <form className="platform-form" onSubmit={(e) => void submit(e)}>
        <label htmlFor="displayName">Nama tampilan</label>
        <input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="password">Kata sandi</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="banner error">{error}</p> : null}
        <button type="submit" className="btn btn-hot" disabled={pending}>
          Buat akun
        </button>
        <p className="meta">
          Sudah punya akun? <Link href="/masuk">Masuk</Link>
        </p>
      </form>
    </>
  );
}