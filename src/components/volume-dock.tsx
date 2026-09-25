import { useEffect, useState } from "react";
import { Minus, Plus, Volume2, VolumeX } from "lucide-react";
import {
  getAudioState,
  initAudioFromStorage,
  nudgeLobbyVolume,
  setLobbyVolume,
  subscribeAudio,
  toggleLobbyMute,
  unlockLobby,
} from "@/lib/lobby-audio";

export function VolumeDock() {
  const [state, setState] = useState({ volume: 0.55, muted: false, unlocked: false });

  useEffect(() => {
    initAudioFromStorage();
    setState(getAudioState());
    const unsub = subscribeAudio(() => setState(getAudioState()));
    void unlockLobby();

    const onFirstGesture = () => {
      void unlockLobby();
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

  return (
    <div className="fixed bottom-5 left-4 z-20 sm:bottom-8 sm:left-8">
      {!state.unlocked ? (
        <button
          type="button"
          onClick={() => void unlockLobby()}
          className="rounded-full border border-primary/50 bg-surface/90 px-4 py-2 font-serif text-sm text-accent shadow-[0_0_24px_rgb(232_201_106_/_0.25)] backdrop-blur-sm hover:border-primary"
        >
          Enter lobby
        </button>
      ) : (
        <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-surface/90 px-3 py-2 shadow-[0_0_24px_rgb(232_201_106_/_0.2)] backdrop-blur-sm">
          <button
            type="button"
            onClick={toggleLobbyMute}
            aria-label={silent ? "Unmute lobby music" : "Mute lobby music"}
            className="grid size-8 place-items-center rounded-full text-primary hover:bg-primary/15"
          >
            {silent ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => nudgeLobbyVolume(-0.1)}
            aria-label="Lower volume"
            className="grid size-7 place-items-center rounded-full text-accent hover:bg-primary/15"
          >
            <Minus className="size-3.5" />
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={pct}
            aria-label="Lobby music volume"
            onChange={(e) => setLobbyVolume(Number(e.target.value) / 100)}
            className="h-1.5 w-24 cursor-pointer accent-primary sm:w-32"
          />
          <button
            type="button"
            onClick={() => nudgeLobbyVolume(0.1)}
            aria-label="Raise volume"
            className="grid size-7 place-items-center rounded-full text-accent hover:bg-primary/15"
          >
            <Plus className="size-3.5" />
          </button>
          <span className="min-w-8 font-mono text-xs text-muted">{pct}%</span>
        </div>
      )}
    </div>
  );
}
