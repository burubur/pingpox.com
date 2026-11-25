"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { BULAN_PANJANG, eventHref, fmtDay, placeLine, type Tournament } from "@/lib/tournament";

const CLONES = 4;
const GAP = 12;

/** "6 – 12 Desember 2026" when the event spans days; a single day otherwise. */
function cardWhen(t: Tournament): string | null {
  if (!t.start) return null;
  const long = (k: string) => {
    const [y, m, d] = k.split("-").map(Number);
    return `${d} ${BULAN_PANJANG[m - 1]} ${y}`;
  };
  if (!t.end || t.end <= t.start) return long(t.start);
  const [ay, am, ad] = t.start.split("-").map(Number);
  const [by, bm, bd] = t.end.split("-").map(Number);
  if (ay === by && am === bm) return `${ad} – ${bd} ${BULAN_PANJANG[am - 1]} ${ay}`;
  if (ay === by) return `${ad} ${BULAN_PANJANG[am - 1]} – ${bd} ${BULAN_PANJANG[bm - 1]} ${ay}`;
  return `${long(t.start)} – ${long(t.end)}`;
}

function deadlineLabel(t: Tournament): string | null {
  if (t.deadline) return fmtDay(t.deadline);
  return t.deadlineText;
}

function Card({ t, clone }: { t: Tournament; clone?: boolean }) {
  const place = placeLine(t);
  const when = cardWhen(t);
  const deadline = deadlineLabel(t);
  const showFeeRow = Boolean(t.fee || deadline);
  return (
    <a
      className="tcard"
      href={eventHref(t)}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      tabIndex={clone ? -1 : undefined}
      aria-hidden={clone ? true : undefined}
    >
      <h3 className="tcard-name">{t.name}</h3>
      {place ? <p className="tcard-place">{place}</p> : null}
      {t.venue ? <p className="tcard-venue">{t.venue}</p> : null}
      {t.categories.length > 0 && (
        <ul className="tcard-divs" aria-label="Divisi">
          {t.categories.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
      {showFeeRow && (
        <p className="tcard-fee">
          {t.fee ? <span>{t.fee}</span> : null}
          {deadline ? <span className="tcard-deadline">Daftar s/d {deadline}</span> : null}
        </p>
      )}
      {t.unconfirmed ? <p className="tcard-unconf">Belum dikonfirmasi</p> : null}
      {when ? <p className="tcard-date">{when}</p> : null}
    </a>
  );
}

export function TournamentCarousel({ items }: { items: Tournament[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false });
  const wheeling = useRef(false);
  const wheelIdle = useRef(0);
  const [loop, setLoop] = useState(false);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const n = items.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const stride = useCallback(() => {
    const el = scroller.current;
    if (!el) return 0;
    const a = el.querySelector<HTMLElement>(".tcard");
    if (!a) return 0;
    return a.offsetWidth + GAP;
  }, []);

  const pad = loop ? Math.min(CLONES, n) : 0;

  const logicalIndex = useCallback(
    (scrollLeft: number, step: number) => {
      if (!step || n === 0) return 0;
      const i = Math.round(scrollLeft / step);
      if (!loop) return Math.min(n - 1, Math.max(0, i));
      return (((i - pad) % n) + n) % n;
    },
    [loop, n, pad],
  );

  const normalize = useCallback(() => {
    const el = scroller.current;
    const step = stride();
    if (!el || !step || !loop || n === 0 || wheeling.current) return;
    const i = Math.round(el.scrollLeft / step);
    if (i < pad || i >= pad + n) {
      const next = pad + ((((i - pad) % n) + n) % n);
      el.scrollTo({ left: next * step, behavior: "auto" });
    }
  }, [loop, n, pad, stride]);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el || n === 0) return;
    const measure = () => {
      const card = el.querySelector<HTMLElement>(".tcard");
      if (!card) return;
      const overflows = n * card.offsetWidth + (n - 1) * GAP > el.clientWidth + 1;
      setLoop(overflows && n > 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  useLayoutEffect(() => {
    const el = scroller.current;
    const step = stride();
    if (!el || !step) return;
    el.scrollTo({ left: (loop ? Math.min(CLONES, n) : 0) * step, behavior: "auto" });
    setIndex(0);
  }, [loop, n, stride]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const step = stride();
      if (!step) return;
      setIndex(logicalIndex(el.scrollLeft, step));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", normalize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", normalize);
    };
  }, [logicalIndex, normalize, stride]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      if (el.scrollWidth <= el.clientWidth + 1) return;
      e.preventDefault();
      // Scroll-snap would pull each small delta back to the current card.
      wheeling.current = true;
      el.style.scrollSnapType = "none";
      el.scrollLeft += dx;
      window.clearTimeout(wheelIdle.current);
      wheelIdle.current = window.setTimeout(() => {
        wheeling.current = false;
        el.style.scrollSnapType = "";
        const step = stride();
        if (!step) return;
        const i = Math.round(el.scrollLeft / step);
        el.scrollTo({ left: i * step, behavior: "auto" });
        if (!loop || n === 0) return;
        const padNow = Math.min(CLONES, n);
        if (i < padNow || i >= padNow + n) {
          const next = padNow + ((((i - padNow) % n) + n) % n);
          el.scrollTo({ left: next * step, behavior: "auto" });
        }
      }, 140);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.clearTimeout(wheelIdle.current);
      el.removeEventListener("wheel", onWheel);
    };
  }, [loop, n, stride]);

  const go = (dir: number) => {
    const el = scroller.current;
    const step = stride();
    if (!el || !step) return;
    normalize();
    const behavior = reduced ? "auto" : "smooth";
    el.scrollBy({ left: dir * step, behavior });
  };

  const goTo = (i: number) => {
    const el = scroller.current;
    const step = stride();
    if (!el || !step) return;
    const left = (loop ? Math.min(CLONES, n) + i : i) * step;
    el.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  };

  const atStart = !loop && index <= 0;
  const atEnd = !loop && index >= n - 1;

  const endDrag = () => {
    drag.current.on = false;
    normalize();
  };

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    go(e.key === "ArrowRight" ? 1 : -1);
  };

  if (n === 0) return null;

  const head = loop ? items.slice(0, pad) : [];
  const tail = loop ? items.slice(-pad) : [];
  const slides = [
    ...tail.map((t) => ({ t, clone: true, key: `pre-${t.id}` })),
    ...items.map((t) => ({ t, clone: false, key: t.id })),
    ...head.map((t) => ({ t, clone: true, key: `post-${t.id}` })),
  ];

  return (
    <div className="carousel">
      <div
        className="carousel-view"
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Semua turnamen"
        onKeyDown={onKey}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          const el = scroller.current;
          if (!el) return;
          drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false };
          el.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const el = scroller.current;
          if (!drag.current.on || !el) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          el.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onClickCapture={(e) => {
          if (!drag.current.moved) return;
          e.preventDefault();
          e.stopPropagation();
          drag.current.moved = false;
        }}
      >
        {slides.map(({ t, clone, key }) => (
          <div className="tcard-slot" key={key} aria-hidden={clone ? true : undefined}>
            <Card t={t} clone={clone} />
          </div>
        ))}
      </div>
      {loop && (
      <div className="carousel-controls">
        <button type="button" className="carousel-btn" aria-label="Turnamen sebelumnya" disabled={atStart} onClick={() => go(-1)}>
          ‹
        </button>
        <div className="carousel-dots" aria-label="Posisi turnamen">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Ke kartu ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={i === index ? "on" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button type="button" className="carousel-btn" aria-label="Turnamen berikutnya" disabled={atEnd} onClick={() => go(1)}>
          ›
        </button>
      </div>
      )}
    </div>
  );
}
