"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LIST_URL_KEY } from "@/lib/tournament";

/** "‹ Kembali" to the list, restoring the filters the visitor last used there. */
export default function BackLink() {
  const [href, setHref] = useState("/");
  useEffect(() => {
    const saved = sessionStorage.getItem(LIST_URL_KEY);
    if (saved && saved.startsWith("/")) setHref(saved);
  }, []);
  return (
    <div className="backbar">
      <div className="wrap">
        <Link href={href}>‹ Kembali</Link>
      </div>
    </div>
  );
}
