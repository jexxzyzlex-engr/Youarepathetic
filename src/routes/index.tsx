import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { GoldClock } from "@/components/gold-clock";
import { VolumeDock } from "@/components/volume-dock";
import { WorldTime } from "@/components/world-time";

export const Route = createFileRoute("/")({ component: Home });

const TARGET = new Date("2032-09-24T21:14:00-07:00").getTime();
const START = new Date("2026-09-24T21:14:00-07:00").getTime();
const TOTAL = TARGET - START;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  percent: number;
  done: boolean;
};

function compute(): Remaining {
  const now = Date.now();
  const diff = TARGET - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, percent: 100, done: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const elapsed = now - START;
  const percent = Math.min(100, Math.max(0, (elapsed / TOTAL) * 100));
  return { days, hours, minutes, seconds, percent, done: false };
}

function Home() {
  const [t, setT] = useState<Remaining | null>(null);

  useEffect(() => {
    setT(compute());
    const id = window.setInterval(() => setT(compute()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const display = t ?? {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    percent: 0,
    done: false,
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-start overflow-x-hidden bg-bg px-4 pt-32 pb-16 text-fg sm:justify-center sm:pt-16">
      <GoldClock />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[#2a0a10]/20" />
      <WorldTime />

      <div className="relative z-10 w-full max-w-3xl text-center">
        <p className="mb-3 font-serif text-sm font-medium tracking-[0.28em] text-primary uppercase">
          Live Countdown
        </p>
        <h1 className="mb-2 font-serif text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
          Have i failed?
        </h1>
        <p className="mb-8 font-serif font-light text-muted italic">Time remaining until September 24, 2032</p>

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-surface/80 px-5 py-2 font-serif text-sm text-accent shadow-[0_0_20px_rgb(232_201_106_/_0.15)] backdrop-blur-sm">
          <Calendar className="size-4 opacity-80" aria-hidden="true" />
          <span>September 24, 2032</span>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Unit value={display.days.toLocaleString()} label="Days" />
          <Unit value={pad(display.hours)} label="Hours" />
          <Unit value={pad(display.minutes)} label="Minutes" />
          <Unit value={pad(display.seconds)} label="Seconds" pulse />
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-2 flex justify-between font-serif text-sm text-muted">
            <span>Progress</span>
            <span>{display.percent.toFixed(2)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full border border-primary/25 bg-[#2a0a10]/70">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary to-accent transition-[width] duration-1000"
              style={{ width: `${display.percent}%` }}
            />
          </div>
        </div>
      </div>

      <p className="relative z-10 mt-10 font-serif text-sm text-muted italic">
        Countdown started from September 24, 2026
      </p>

      <VolumeDock />

      <blockquote className="pointer-events-none absolute right-4 bottom-16 z-10 max-w-[14rem] text-right sm:right-8 sm:bottom-8 sm:max-w-xs">
        <p className="font-serif text-lg leading-snug font-medium text-accent/90 italic sm:text-xl">
          From 6 years ago to
          <br />
          You from Today
        </p>
        <footer className="mt-2 font-serif text-base text-muted italic">— Jexxz</footer>
      </blockquote>
    </main>
  );
}

function Unit({
  value,
  label,
  pulse,
}: {
  value: string;
  label: string;
  pulse?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/35 bg-surface/75 px-3 py-6 shadow-[0_0_28px_rgb(232_201_106_/_0.12)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-[0_12px_40px_rgb(232_201_106_/_0.28)]">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-80" />
      <div
        className={`font-serif text-4xl leading-none tracking-tight text-accent sm:text-5xl ${pulse ? "animate-pulse" : ""}`}
      >
        {value}
      </div>
      <div className="mt-2.5 text-xs font-medium tracking-widest text-primary uppercase">{label}</div>
    </div>
  );
}
