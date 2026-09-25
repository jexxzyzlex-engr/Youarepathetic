import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Minus, i as Plus, n as Volume2, o as Calendar, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DR4es_Hg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "lobby-volume";
var DEFAULT_VOLUME = .55;
var listeners = /* @__PURE__ */ new Set();
var volume = DEFAULT_VOLUME;
var muted = false;
var music = null;
var ctx = null;
var unlocked = false;
var lastTickSec = -1;
function notify() {
	for (const fn of listeners) fn();
}
function clamp(n) {
	return Math.min(1, Math.max(0, n));
}
function loadSaved() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw == null) return;
		const n = Number(raw);
		if (!Number.isNaN(n)) volume = clamp(n);
	} catch {}
}
function save() {
	try {
		localStorage.setItem(STORAGE_KEY, String(volume));
	} catch {}
}
function appliedVolume() {
	return muted ? 0 : volume;
}
function ensureMusic() {
	if (music) return music;
	const el = new Audio("/xevel.mp3");
	el.loop = true;
	el.preload = "auto";
	el.volume = appliedVolume();
	music = el;
	return el;
}
function ensureCtx() {
	if (ctx) return ctx;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return null;
	ctx = new AC();
	return ctx;
}
function subscribeAudio(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}
function getAudioState() {
	return {
		volume,
		muted,
		unlocked
	};
}
async function unlockLobby() {
	if (typeof window === "undefined") return;
	loadSaved();
	const el = ensureMusic();
	el.volume = appliedVolume();
	const audioCtx = ensureCtx();
	if (audioCtx && audioCtx.state === "suspended") await audioCtx.resume().catch(() => {});
	try {
		await el.play();
		unlocked = true;
		notify();
	} catch {
		unlocked = false;
		notify();
	}
}
function setLobbyVolume(next) {
	volume = clamp(next);
	if (volume > 0) muted = false;
	if (music) music.volume = appliedVolume();
	save();
	notify();
}
function nudgeLobbyVolume(delta) {
	setLobbyVolume(volume + delta);
}
function toggleLobbyMute() {
	muted = !muted;
	if (music) music.volume = appliedVolume();
	notify();
}
function playTick(high) {
	if (typeof window === "undefined") return;
	if (!unlocked || muted || volume <= 0) return;
	const audioCtx = ensureCtx();
	if (!audioCtx) return;
	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();
	osc.type = "square";
	osc.frequency.value = high ? 1180 : 780;
	const peak = .045 * volume;
	const now = audioCtx.currentTime;
	gain.gain.setValueAtTime(peak, now);
	gain.gain.exponentialRampToValueAtTime(8e-4, now + .07);
	osc.connect(gain);
	gain.connect(audioCtx.destination);
	osc.start(now);
	osc.stop(now + .08);
}
function tickIfSecondChanged(secondFloat) {
	const sec = Math.floor(secondFloat) % 60;
	if (sec === lastTickSec) return;
	lastTickSec = sec;
	playTick(sec % 2 === 0);
}
function initAudioFromStorage() {
	if (typeof window === "undefined") return;
	loadSaved();
}
var TARGET$1 = (/* @__PURE__ */ new Date("2032-09-24T21:14:00-07:00")).getTime();
var ROMAN = [
	"XII",
	"I",
	"II",
	"III",
	"IV",
	"V",
	"VI",
	"VII",
	"VIII",
	"IX",
	"X",
	"XI"
];
function remainingAngles() {
	const diff = Math.max(0, TARGET$1 - Date.now());
	const hours = Math.floor(diff % 864e5 / 36e5);
	const minutes = Math.floor(diff % 36e5 / 6e4);
	const seconds = diff % 6e4 / 1e3;
	return {
		hour: (hours % 12 + minutes / 60) * 30,
		minute: (minutes + seconds / 60) * 6,
		second: seconds * 6,
		seconds
	};
}
function GoldClock() {
	const [angles, setAngles] = (0, import_react.useState)({
		hour: 0,
		minute: 0,
		second: 0
	});
	(0, import_react.useEffect)(() => {
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const apply = () => {
			const next = remainingAngles();
			setAngles({
				hour: next.hour,
				minute: next.minute,
				second: next.second
			});
			tickIfSecondChanged(next.seconds);
		};
		apply();
		if (reduced) {
			const id = window.setInterval(apply, 1e3);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": "true",
		className: "pointer-events-none fixed inset-0 z-0 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/stage-curtains.jpg",
				alt: "",
				className: "absolute inset-0 size-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgb(40_8_12_/_0.5)_100%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-1/2 left-1/2 w-[min(96vw,780px)] -translate-x-1/2 -translate-y-1/2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "size-full drop-shadow-[0_0_40px_rgb(232_201_106_/_0.45)]",
					viewBox: "0 0 200 200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
								id: "gold-face",
								cx: "50%",
								cy: "38%",
								r: "70%",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#5a1c22",
									stopOpacity: "0.12"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#2a0a10",
									stopOpacity: "0.28"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "gold-stroke",
								x1: "0",
								y1: "0",
								x2: "1",
								y2: "1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#fff3c4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "45%",
										stopColor: "#e8c96a"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#b8862a"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
								id: "gold-glow",
								x: "-50%",
								y: "-50%",
								width: "200%",
								height: "200%",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", {
									stdDeviation: "1.6",
									result: "b"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "b" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "SourceGraphic" })] })]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "100",
							cy: "100",
							r: "96",
							fill: "url(#gold-face)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "100",
							cy: "100",
							r: "94",
							fill: "none",
							stroke: "url(#gold-stroke)",
							strokeWidth: "1.2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "100",
							cy: "100",
							r: "88",
							fill: "none",
							stroke: "url(#gold-stroke)",
							strokeWidth: "0.6",
							opacity: "0.7"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "100",
							cy: "100",
							r: "82",
							fill: "none",
							stroke: "url(#gold-stroke)",
							strokeWidth: "1.8"
						}),
						Array.from({ length: 60 }, (_, i) => {
							const major = i % 5 === 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: "100",
								y1: major ? "16" : "18",
								x2: "100",
								y2: major ? "24" : "21",
								stroke: major ? "#f5e6a8" : "rgb(232 201 106 / 0.45)",
								strokeWidth: major ? "1.5" : "0.6",
								transform: `rotate(${i * 6} 100 100)`
							}, i);
						}),
						ROMAN.map((label, i) => {
							const a = (i * 30 - 90) * Math.PI / 180;
							const x = Number((100 + 68 * Math.cos(a)).toFixed(2));
							const y = Number((100 + 68 * Math.sin(a)).toFixed(2));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x,
								y,
								textAnchor: "middle",
								dominantBaseline: "middle",
								fill: "#f6e7b2",
								fontFamily: "Georgia, 'Times New Roman', serif",
								fontSize: label === "XII" || label === "III" || label === "VI" || label === "IX" ? 11 : 9,
								fontWeight: "600",
								filter: "url(#gold-glow)",
								children: label
							}, label);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							filter: "url(#gold-glow)",
							style: {
								transform: `rotate(${angles.hour}deg)`,
								transformOrigin: "100px 100px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M96.6 108 L98.4 58 L100 46 L101.6 58 L103.4 108 Z",
								fill: "#4a2010"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M97.4 106 L99 58 L100 50 L101 58 L102.6 106 Z",
								fill: "#f8ecc0"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							filter: "url(#gold-glow)",
							style: {
								transform: `rotate(${angles.minute}deg)`,
								transformOrigin: "100px 100px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M97.4 114 L99 34 L100 22 L101 34 L102.6 114 Z",
								fill: "#3a180c"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M98.1 112 L99.3 34 L100 26 L100.7 34 L101.9 112 Z",
								fill: "#ffe9a0"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							filter: "url(#gold-glow)",
							style: {
								transform: `rotate(${angles.second}deg)`,
								transformOrigin: "100px 100px"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "100",
									y1: "128",
									x2: "100",
									y2: "18",
									stroke: "#5a2410",
									strokeWidth: "2.4",
									strokeLinecap: "round"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "100",
									y1: "126",
									x2: "100",
									y2: "20",
									stroke: "#ffd36a",
									strokeWidth: "1.15",
									strokeLinecap: "round"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "100",
									cy: "24",
									r: "2.1",
									fill: "#fff4c8"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "100",
							cy: "100",
							r: "5.2",
							fill: "#fff4c8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "100",
							cy: "100",
							r: "2.2",
							fill: "#c9a227"
						})
					]
				})
			})
		]
	});
}
function VolumeDock() {
	const [state, setState] = (0, import_react.useState)({
		volume: .55,
		muted: false,
		unlocked: false
	});
	(0, import_react.useEffect)(() => {
		initAudioFromStorage();
		setState(getAudioState());
		const unsub = subscribeAudio(() => setState(getAudioState()));
		unlockLobby();
		const onFirstGesture = () => {
			unlockLobby();
		};
		window.addEventListener("pointerdown", onFirstGesture);
		window.addEventListener("keydown", onFirstGesture);
		return () => {
			unsub();
			window.removeEventListener("pointerdown", onFirstGesture);
			window.removeEventListener("keydown", onFirstGesture);
		};
	}, []);
	const pct = Math.round(state.volume * 100);
	const silent = state.muted || state.volume === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-5 left-4 z-20 sm:bottom-8 sm:left-8",
		children: !state.unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => void unlockLobby(),
			className: "rounded-full border border-primary/50 bg-surface/90 px-4 py-2 font-serif text-sm text-accent shadow-[0_0_24px_rgb(232_201_106_/_0.25)] backdrop-blur-sm hover:border-primary",
			children: "Enter lobby"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 rounded-full border border-primary/40 bg-surface/90 px-3 py-2 shadow-[0_0_24px_rgb(232_201_106_/_0.2)] backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: toggleLobbyMute,
					"aria-label": silent ? "Unmute lobby music" : "Mute lobby music",
					className: "grid size-8 place-items-center rounded-full text-primary hover:bg-primary/15",
					children: silent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => nudgeLobbyVolume(-.1),
					"aria-label": "Lower volume",
					className: "grid size-7 place-items-center rounded-full text-accent hover:bg-primary/15",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 100,
					value: pct,
					"aria-label": "Lobby music volume",
					onChange: (e) => setLobbyVolume(Number(e.target.value) / 100),
					className: "h-1.5 w-24 cursor-pointer accent-primary sm:w-32"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => nudgeLobbyVolume(.1),
					"aria-label": "Raise volume",
					className: "grid size-7 place-items-center rounded-full text-accent hover:bg-primary/15",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-8 font-mono text-xs text-muted",
					children: [pct, "%"]
				})
			]
		})
	});
}
var TARGET = (/* @__PURE__ */ new Date("2032-09-24T21:14:00-07:00")).getTime();
var START = (/* @__PURE__ */ new Date("2026-09-24T21:14:00-07:00")).getTime();
var TOTAL = TARGET - START;
function pad(n) {
	return n.toString().padStart(2, "0");
}
function compute() {
	const now = Date.now();
	const diff = TARGET - now;
	if (diff <= 0) return {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		percent: 100,
		done: true
	};
	const days = Math.floor(diff / 864e5);
	const hours = Math.floor(diff % 864e5 / 36e5);
	const minutes = Math.floor(diff % 36e5 / 6e4);
	const seconds = Math.floor(diff % 6e4 / 1e3);
	const elapsed = now - START;
	return {
		days,
		hours,
		minutes,
		seconds,
		percent: Math.min(100, Math.max(0, elapsed / TOTAL * 100)),
		done: false
	};
}
function Home() {
	const [t, setT] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setT(compute());
		const id = window.setInterval(() => setT(compute()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	const display = t ?? {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		percent: 0,
		done: false
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative flex min-h-dvh flex-col items-center justify-center overflow-x-hidden bg-bg px-4 py-16 text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldClock, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none fixed inset-0 z-[1] bg-[#2a0a10]/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 w-full max-w-3xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 font-serif text-sm font-medium tracking-[0.28em] text-primary uppercase",
						children: "Live Countdown"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mb-2 font-serif text-4xl font-semibold tracking-tight text-accent sm:text-5xl",
						children: "Have i failed?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-8 font-serif font-light text-muted italic",
						children: "Time remaining until September 24, 2032"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-surface/80 px-5 py-2 font-serif text-sm text-accent shadow-[0_0_20px_rgb(232_201_106_/_0.15)] backdrop-blur-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
							className: "size-4 opacity-80",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "September 24, 2032" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
								value: display.days.toLocaleString(),
								label: "Days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
								value: pad(display.hours),
								label: "Hours"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
								value: pad(display.minutes),
								label: "Minutes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unit, {
								value: pad(display.seconds),
								label: "Seconds",
								pulse: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto w-full max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex justify-between font-serif text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [display.percent.toFixed(2), "%"] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 overflow-hidden rounded-full border border-primary/25 bg-[#2a0a10]/70",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-linear-to-r from-primary to-accent transition-[width] duration-1000",
								style: { width: `${display.percent}%` }
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative z-10 mt-10 font-serif text-sm text-muted italic",
				children: "Countdown started from September 24, 2026"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeDock, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
				className: "pointer-events-none absolute right-4 bottom-16 z-10 max-w-[14rem] text-right sm:right-8 sm:bottom-8 sm:max-w-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-serif text-lg leading-snug font-medium text-accent/90 italic sm:text-xl",
					children: [
						"From 6 years ago to",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"You from Today"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "mt-2 font-serif text-base text-muted italic",
					children: "— Jexxz"
				})]
			})
		]
	});
}
function Unit({ value, label, pulse }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border border-primary/35 bg-surface/75 px-3 py-6 shadow-[0_0_28px_rgb(232_201_106_/_0.12)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-[0_12px_40px_rgb(232_201_106_/_0.28)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `font-serif text-4xl leading-none tracking-tight text-accent sm:text-5xl ${pulse ? "animate-pulse" : ""}`,
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2.5 text-xs font-medium tracking-widest text-primary uppercase",
				children: label
			})
		]
	});
}
//#endregion
export { Home as component };
