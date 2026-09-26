"use client";

import { useEffect, useState } from "react";

/**
 * The current time in my time zone, kept current to the minute. The page is static, so the
 * server can't know the time; it renders a placeholder and the clock fills in on load.
 */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const text = now ? new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(now) : "--:--";
  return (
    <time dateTime={now?.toISOString()} className="tabular">
      {text}
    </time>
  );
}
