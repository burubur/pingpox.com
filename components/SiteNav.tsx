"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import {
  CALENDAR_HREF,
  featuredEvent,
  isChromeLive,
  LIST_HREF,
  upcomingChrome,
  URL_CHANGE_EVENT,
  type ChromeEvent,
} from "@/lib/chrome";
import { useToday } from "@/lib/use-today";
import type { DayKey } from "@/lib/tournament";
import { Logo } from "./Logo";

type Feature = { event: ChromeEvent; kind: "next" | "live" };

function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** True when #tentang is the section in view, including when the page cannot scroll it any higher. */
function tentangInView(header: HTMLElement | null): boolean {
  const el = document.getElementById("tentang");
  if (!el) return false;
  const headerH = header?.offsetHeight ?? 60;
  const rect = el.getBoundingClientRect();
  const visible = rect.bottom > headerH + 8 && rect.top < window.innerHeight - 8;
  if (!visible) return false;
  const inReadingBand = rect.top <= Math.max(headerH + 16, window.innerHeight * 0.65);
  const atPageEnd =
    window.scrollY > 8 &&
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
  return inReadingBand || atPageEnd;
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
  // #tentang is a section on the current page. The underline follows whether that
  // section is in view, and also the URL after filters rewrite it. Any other hash
  // keeps the path rules: "/" is Beranda, "/turnamen" and "/turnamen/…" are Turnamen.
  // "/pemain" and "/berita" stay active from the path alone, including when
  // #tentang is in view on a short page. Only one top-level item is underlined.
  const [onAbout, setOnAbout] = useState(false);
  const pendingAbout = useRef(false);
  const suppressAbout = useRef(false);
  const onHome = !onAbout && path === "/";
  const onEvents = !onAbout && (path === "/turnamen" || !!path?.startsWith("/turnamen/"));
  const onPlayers = path === "/pemain" || !!path?.startsWith("/pemain/");
  const onNews = path === "/berita" || !!path?.startsWith("/berita/");

  useLayoutEffect(() => {
    let timer = 0;
    let raf = 0;
    const inView = () => tentangInView(headerRef.current);
    const clearTimer = () => window.clearTimeout(timer);

    const applyViewport = () => {
      if (pendingAbout.current && window.location.hash === "#tentang" && !inView()) return;
      pendingAbout.current = false;
      clearTimer();
      if (suppressAbout.current) {
        if (!inView()) suppressAbout.current = false;
        return;
      }
      setOnAbout(inView());
    };

    const arm = () => {
      suppressAbout.current = false;
      clearTimer();
      setOnAbout(true);
      if (inView()) {
        pendingAbout.current = false;
        return;
      }
      pendingAbout.current = true;
      timer = window.setTimeout(() => {
        pendingAbout.current = false;
        if (suppressAbout.current) return;
        setOnAbout(inView());
      }, 1500);
    };

    const onScroll = () => {
      const visible = inView();
      if (suppressAbout.current) {
        if (!visible) suppressAbout.current = false;
        else return;
      }
      if (visible) {
        pendingAbout.current = false;
        clearTimer();
        setOnAbout(true);
        return;
      }
      if (pendingAbout.current && window.location.hash === "#tentang") return;
      pendingAbout.current = false;
      setOnAbout(false);
    };

    // Home filters call history.replaceState, which drops #tentang and fires
    // neither hashchange nor popstate. A cleared hash turns the underline off
    // until the section leaves the viewport and the reader comes back.
    const onUrl = () => {
      pendingAbout.current = false;
      clearTimer();
      if (window.location.hash === "#tentang") {
        suppressAbout.current = false;
        setOnAbout(inView());
        return;
      }
      suppressAbout.current = true;
      setOnAbout(false);
    };

    const onHash = () => {
      if (window.location.hash === "#tentang") {
        arm();
        return;
      }
      pendingAbout.current = false;
      clearTimer();
      if (suppressAbout.current) return;
      setOnAbout(inView());
    };

    const onPop = () => {
      pendingAbout.current = false;
      clearTimer();
      suppressAbout.current = false;
      if (window.location.hash === "#tentang") {
        if (inView()) setOnAbout(true);
        else arm();
        return;
      }
      setOnAbout(inView());
    };

    if (window.location.hash === "#tentang") {
      if (inView()) setOnAbout(true);
      else arm();
    } else {
      suppressAbout.current = false;
      pendingAbout.current = false;
      setOnAbout(inView());
    }

    const onScrollRaf = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", onScrollRaf, { passive: true });
    window.addEventListener("resize", onScrollRaf);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onPop);
    window.addEventListener(URL_CHANGE_EVENT, onUrl);
    window.addEventListener("scrollend", applyViewport);
    return () => {
      window.cancelAnimationFrame(raf);
      clearTimer();
      window.removeEventListener("scroll", onScrollRaf);
      window.removeEventListener("resize", onScrollRaf);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener(URL_CHANGE_EVENT, onUrl);
      window.removeEventListener("scrollend", applyViewport);
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
            href="/pemain"
            className={onPlayers ? "on" : undefined}
            aria-current={onPlayers ? "page" : undefined}
            onClick={close}
          >
            Pemain
          </a>
          <a
            href="/berita"
            className={onNews ? "on" : undefined}
            aria-current={onNews ? "page" : undefined}
            onClick={close}
          >
            Berita
          </a>
          <a
            href="#tentang"
            className={onAbout && !onPlayers && !onNews ? "on" : undefined}
            aria-current={onAbout && !onPlayers && !onNews ? "location" : undefined}
            onClick={(e) => {
              suppressAbout.current = false;
              pendingAbout.current = !tentangInView(headerRef.current);
              setOnAbout(true);
              close();
              if (window.location.hash !== "#tentang") return;
              e.preventDefault();
              document.getElementById("tentang")?.scrollIntoView({ block: "start" });
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
