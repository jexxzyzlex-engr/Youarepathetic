const STORAGE_KEY = "lobby-volume";
const DEFAULT_VOLUME = 0.55;

type Listener = () => void;
const listeners = new Set<Listener>();

let volume = DEFAULT_VOLUME;
let muted = false;
let music: HTMLAudioElement | null = null;
let ctx: AudioContext | null = null;
let unlocked = false;
let lastTickSec = -1;

function notify() {
  for (const fn of listeners) fn();
}

function clamp(n: number) {
  return Math.min(1, Math.max(0, n));
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return;
    const n = Number(raw);
    if (!Number.isNaN(n)) volume = clamp(n);
  } catch {
    /* ignore */
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, String(volume));
  } catch {
    /* ignore */
  }
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
  const AC = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

export function subscribeAudio(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getAudioState() {
  return { volume, muted, unlocked };
}

export async function unlockLobby() {
  if (typeof window === "undefined") return;
  loadSaved();
  const el = ensureMusic();
  el.volume = appliedVolume();
  const audioCtx = ensureCtx();
  if (audioCtx && audioCtx.state === "suspended") {
    await audioCtx.resume().catch(() => {});
  }
  try {
    await el.play();
    unlocked = true;
    notify();
  } catch {
    unlocked = false;
    notify();
  }
}

export function setLobbyVolume(next: number) {
  volume = clamp(next);
  if (volume > 0) muted = false;
  if (music) music.volume = appliedVolume();
  save();
  notify();
}

export function nudgeLobbyVolume(delta: number) {
  setLobbyVolume(volume + delta);
}

export function toggleLobbyMute() {
  muted = !muted;
  if (music) music.volume = appliedVolume();
  notify();
}

export function playTick(high: boolean) {
  if (typeof window === "undefined") return;
  if (!unlocked || muted || volume <= 0) return;
  const audioCtx = ensureCtx();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "square";
  osc.frequency.value = high ? 1180 : 780;
  const peak = 0.045 * volume;
  const now = audioCtx.currentTime;
  gain.gain.setValueAtTime(peak, now);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.07);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

export function tickIfSecondChanged(secondFloat: number) {
  const sec = Math.floor(secondFloat) % 60;
  if (sec === lastTickSec) return;
  lastTickSec = sec;
  playTick(sec % 2 === 0);
}

export function initAudioFromStorage() {
  if (typeof window === "undefined") return;
  loadSaved();
}
