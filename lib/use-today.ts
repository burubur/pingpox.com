"use client";

import { useEffect, useState } from "react";
import { todayKey, type DayKey } from "./tournament";

/**
 * Today's date for past/live/deadline flags. Pages are generated at build time, so the first
 * render uses the build day (`initial`, Jakarta time) to match the static HTML, then switches
 * to the visitor's own date after hydration and keeps it current.
 */
export function useToday(initial: DayKey): DayKey {
  const [today, setToday] = useState(initial);
  useEffect(() => {
    const update = () => setToday(todayKey());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return today;
}
