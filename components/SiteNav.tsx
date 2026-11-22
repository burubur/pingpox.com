"use client";

import { Suspense, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CALENDAR_HREF,
  featuredEvent,
  isChromeLive,
  LIST_HREF,
  upcomingChrome,
  type ChromeEvent,
} from "@/lib/chrome";
import { useToday } from "@/lib/use-today";
import type { DayKey } from "@/lib/tournament";
import { Logo } from "./Logo";

type Feature = { event: ChromeEvent; kind: "next" | "live" };

function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Home filters rewrite the URL with history.replaceState, which drops the hash and fires neither hashchange nor popstate. */
function HashSync({ onHash }: { onHash: (hash: string) => void }) {
  const path = usePathname();
  const search = useSearchParams().toString();
  useLayoutEffect(() => {
    onHash(window.location.hash);
  }, [onHash, path, search]);
  return null;
}

export function SiteHeader({ events, buildDay }: { events: ChromeEvent[]; buildDay: DayKey }) {
  const today = useToday(buildDay);
  const upcoming = upcomingChrome(events, today).slice(0, 4);
  const feature = featuredEvent(events, today);
  const path = usePathname();
  const [panel, setPanel] = useState(false);
  const [mobile, setMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const turnamenBtn = useRef<HTMLButtonElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);
  const pendingPanelFocus = useRef(false);
  const pendingMobileFocus = useRef(false);
  const ignoreFocus = useRef(false);
  const panelId = useId();
  const navId = useId();
  const [hash, setHash] = useState("");
  // #tentang is the footer section. usePathname() omits the hash, so read it here.
  // Any other hash keeps the path rules: "/" is Beranda, "/turnamen" and "/turnamen/…" are Turnamen.
  // Query strings such as ?q= or ?tampilan=kalender stay on Beranda.
  const onAbout = hash === "#tentang";
  const onHome = !onAbout && path === "/";
  const onEvents = !onAbout && (path === "/turnamen" || !!path?.startsWith("/turnamen/"));

  useLayoutEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [path]);

  useEffect(() => {
    setPanel(false);
    setMobile(false);
  }, [path]);

  useEffect(() => {
    if (!panel || !pendingPanelFocus.current) return;
    pendingPanelFocus.current = false;
    const link = panelRef.current?.querySelector("a");
    if (link instanceof HTMLAnchorElement) link.focus();
  }, [panel]);

  useEffect(() => {
    if (!mobile || !pendingMobileFocus.current) return;
    pendingMobileFocus.current = false;
    const link = navRef.current?.querySelector("a");
    if (link instanceof HTMLAnchorElement) link.focus();
  }, [mobile]);

  useEffect(() => {
    if (!panel && !mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (panel) {
        ignoreFocus.current = true;
        turnamenBtn.current?.focus();
      } else {
        toggleBtn.current?.focus();
      }
      setPanel(false);
      setMobile(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setPanel(false);
        setMobile(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [panel, mobile]);

  const close = () => {
    setPanel(false);
    setMobile(false);
  };

  const onTurnamenKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "ArrowDown") return;
    e.preventDefault();
    pendingPanelFocus.current = true;
    setPanel(true);
  };

  return (
    <header className={`nav${mobile ? " menu-open" : ""}`} ref={headerRef}>
      <Suspense fallback={null}>
        <HashSync onHash={setHash} />
      </Suspense>
      <div className="wrap nav-bar">
        <a className="logo" href="/" aria-label="Beranda PingpoX" onClick={close}>
          <Logo />
        </a>
        <nav className="navlinks" id={navId} aria-label="Utama" ref={navRef}>
          <a href="/" className={onHome ? "on" : undefined} aria-current={onHome ? "page" : undefined} onClick={close}>
            Beranda
          </a>
          <div
            className={`navitem${panel ? " open" : ""}`}
            onMouseEnter={() => {
              if (finePointer()) setPanel(true);
            }}
            onMouseLeave={() => {
              if (finePointer()) setPanel(false);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPanel(false);
            }}
          >
            <button
              ref={turnamenBtn}
              type="button"
              className={onEvents ? "on" : undefined}
              aria-current={onEvents ? "page" : undefined}
              aria-expanded={panel}
              aria-controls={panelId}
              aria-haspopup="true"
              onClick={() => {
                if (!finePointer()) setPanel((open) => !open);
              }}
              onFocus={(e) => {
                if (ignoreFocus.current) {
                  ignoreFocus.current = false;
                  return;
                }
                if (e.currentTarget.matches(":focus-visible") && finePointer()) setPanel(true);
              }}
              onKeyDown={onTurnamenKey}
            >
              Turnamen
              <span aria-hidden="true" className="caret">
                ▾
              </span>
            </button>
            <div className="mega" id={panelId} ref={panelRef} role="region" aria-label="Turnamen">
              <div className="mega-inner">
                <div className="mega-col">
                  <p className="lbl">Jadwal</p>
                  <a href={LIST_HREF} onClick={close}>
                    <b>Daftar turnamen</b>
                    <span>Semua turnamen yang tercatat</span>
                  </a>
                  <a href={CALENDAR_HREF} onClick={close}>
                    <b>Kalender</b>
                    <span>Jadwal per bulan</span>
                  </a>
                </div>
                <div className="mega-col">
                  <p className="lbl">Mendatang</p>
                  {upcoming.length === 0 ? (
                    <p className="mega-empty">Belum ada turnamen mendatang di jadwal ini.</p>
                  ) : (
                    upcoming.map((event) => (
                      <a key={event.href} href={event.href} onClick={close}>
                        <b>{event.name}</b>
                        <span>
                          {event.when}
                          {isChromeLive(event, today) ? " · berlangsung" : ""}
                          {event.unconfirmed ? " · belum dikonfirmasi" : ""}
                        </span>
                      </a>
                    ))
                  )}
                </div>
                <FeatureTile feature={feature} onNavigate={close} />
              </div>
            </div>
          </div>
          <a
            href="#tentang"
            className={onAbout ? "on" : undefined}
            aria-current={onAbout ? "page" : undefined}
            onClick={() => {
              setHash("#tentang");
              close();
            }}
          >
            Tentang data
          </a>
        </nav>
        <form className="navsearch" action={LIST_HREF} method="get" role="search">
          <label>
            <span className="sr">Cari turnamen</span>
            <input type="search" name="q" placeholder="Cari turnamen" autoComplete="off" enterKeyHint="search" />
          </label>
          <button type="submit">Cari</button>
        </form>
        <button
          ref={toggleBtn}
          type="button"
          className="nav-toggle"
          aria-expanded={mobile}
          aria-controls={navId}
          onClick={() => {
            setMobile((open) => {
              const next = !open;
              pendingMobileFocus.current = next;
              return next;
            });
          }}
        >
          <span className="sr">{mobile ? "Tutup menu" : "Buka menu"}</span>
          <span className="burger" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

function FeatureTile({ feature, onNavigate }: { feature: Feature | null; onNavigate: () => void }) {
  if (!feature) {
    return (
      <a className="mega-feature g1" href={CALENDAR_HREF} onClick={onNavigate}>
        <span className="lbl">Jadwal</span>
        <strong>Kalender turnamen</strong>
        <span>Semua turnamen yang tercatat, disusun per bulan.</span>
        <span className="mega-go">Buka kalender</span>
      </a>
    );
  }
  const { event, kind } = feature;
  return (
    <a className={`mega-feature g${event.tone}`} href={event.href} onClick={onNavigate}>
      <span className="lbl">{kind === "live" ? "Sedang berlangsung" : "Berikutnya"}</span>
      <strong>{event.name}</strong>
      <span>
        {event.when}
        {" · "}
        {event.place}
      </span>
      {event.unconfirmed ? (
        <span className="badge b-unconf">Belum dikonfirmasi</span>
      ) : (
        <span className="badge b-conf">Terkonfirmasi</span>
      )}
      <span className="mega-go">Info turnamen</span>
    </a>
  );
}
