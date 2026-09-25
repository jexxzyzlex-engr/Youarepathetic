import { useEffect, useState } from "react";
import { tickIfSecondChanged } from "@/lib/lobby-audio";

const TARGET = new Date("2032-09-24T21:14:00-07:00").getTime();

const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

function remainingAngles() {
  const diff = Math.max(0, TARGET - Date.now());
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = (diff % (1000 * 60)) / 1000;
  return {
    hour: ((hours % 12) + minutes / 60) * 30,
    minute: (minutes + seconds / 60) * 6,
    second: seconds * 6,
    seconds,
  };
}

export function GoldClock() {
  const [angles, setAngles] = useState({ hour: 0, minute: 0, second: 0 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const apply = () => {
      const next = remainingAngles();
      setAngles({ hour: next.hour, minute: next.minute, second: next.second });
      tickIfSecondChanged(next.seconds);
    };
    apply();
    if (reduced) {
      const id = window.setInterval(apply, 1000);
      return () => window.clearInterval(id);
    }
    let frame = 0;
    const loop = () => {
      apply();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <img
        src="/stage-curtains.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgb(40_8_12_/_0.5)_100%)]" />

      <div className="absolute top-1/2 left-1/2 w-[min(96vw,780px)] -translate-x-1/2 -translate-y-1/2">
        <svg className="size-full drop-shadow-[0_0_40px_rgb(232_201_106_/_0.45)]" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="gold-face" cx="50%" cy="38%" r="70%">
              <stop offset="0%" stopColor="#5a1c22" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2a0a10" stopOpacity="0.28" />
            </radialGradient>
            <linearGradient id="gold-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff3c4" />
              <stop offset="45%" stopColor="#e8c96a" />
              <stop offset="100%" stopColor="#b8862a" />
            </linearGradient>
            <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="100" cy="100" r="96" fill="url(#gold-face)" />
          <circle cx="100" cy="100" r="94" fill="none" stroke="url(#gold-stroke)" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="url(#gold-stroke)" strokeWidth="0.6" opacity="0.7" />
          <circle cx="100" cy="100" r="82" fill="none" stroke="url(#gold-stroke)" strokeWidth="1.8" />

          {Array.from({ length: 60 }, (_, i) => {
            const major = i % 5 === 0;
            return (
              <line
                key={i}
                x1="100"
                y1={major ? "16" : "18"}
                x2="100"
                y2={major ? "24" : "21"}
                stroke={major ? "#f5e6a8" : "rgb(232 201 106 / 0.45)"}
                strokeWidth={major ? "1.5" : "0.6"}
                transform={`rotate(${i * 6} 100 100)`}
              />
            );
          })}

          {ROMAN.map((label, i) => {
            const a = ((i * 30 - 90) * Math.PI) / 180;
            const x = Number((100 + 68 * Math.cos(a)).toFixed(2));
            const y = Number((100 + 68 * Math.sin(a)).toFixed(2));
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#f6e7b2"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize={label === "XII" || label === "III" || label === "VI" || label === "IX" ? 11 : 9}
                fontWeight="600"
                filter="url(#gold-glow)"
              >
                {label}
              </text>
            );
          })}

          <g
            filter="url(#gold-glow)"
            style={{ transform: `rotate(${angles.hour}deg)`, transformOrigin: "100px 100px" }}
          >
            <path d="M96.6 108 L98.4 58 L100 46 L101.6 58 L103.4 108 Z" fill="#4a2010" />
            <path d="M97.4 106 L99 58 L100 50 L101 58 L102.6 106 Z" fill="#f8ecc0" />
          </g>
          <g
            filter="url(#gold-glow)"
            style={{ transform: `rotate(${angles.minute}deg)`, transformOrigin: "100px 100px" }}
          >
            <path d="M97.4 114 L99 34 L100 22 L101 34 L102.6 114 Z" fill="#3a180c" />
            <path d="M98.1 112 L99.3 34 L100 26 L100.7 34 L101.9 112 Z" fill="#ffe9a0" />
          </g>
          <g
            filter="url(#gold-glow)"
            style={{ transform: `rotate(${angles.second}deg)`, transformOrigin: "100px 100px" }}
          >
            <line x1="100" y1="128" x2="100" y2="18" stroke="#5a2410" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="100" y1="126" x2="100" y2="20" stroke="#ffd36a" strokeWidth="1.15" strokeLinecap="round" />
            <circle cx="100" cy="24" r="2.1" fill="#fff4c8" />
          </g>
          <circle cx="100" cy="100" r="5.2" fill="#fff4c8" />
          <circle cx="100" cy="100" r="2.2" fill="#c9a227" />
        </svg>
      </div>
    </div>
  );
}
