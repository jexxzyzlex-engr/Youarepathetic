import { useEffect, useState } from "react";

function formatUtc(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(d);
}

function formatLocal(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).format(d);
}

export function WorldTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return null;

  return (
    <div className="fixed top-4 right-4 z-20 rounded-2xl border border-primary/40 bg-surface/90 px-3 py-2 text-right shadow-[0_0_24px_rgb(232_201_106_/_0.2)] backdrop-blur-sm sm:top-6 sm:right-8 sm:px-4 sm:py-2.5">
      <p className="font-serif text-[10px] tracking-[0.22em] text-primary uppercase">World time</p>
      <p className="font-serif text-lg leading-tight text-accent tabular-nums sm:text-2xl">
        {formatUtc(now)}
        <span className="ml-1.5 text-xs tracking-widest text-muted">UTC</span>
      </p>
      <p className="mt-0.5 font-serif text-xs text-muted tabular-nums">{formatLocal(now)}</p>
    </div>
  );
}
