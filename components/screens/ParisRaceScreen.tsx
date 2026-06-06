"use client";

import { useState } from "react";
import type { GameState, RaceResult } from "@/src/types/game";
import { runParisRace } from "@/src/lib/simulation";
import TeamStatusPanel from "@/components/ui/TeamStatusPanel";
import RiskSelector from "@/components/ui/RiskSelector";
import RaceResultPanel from "@/components/ui/RaceResultPanel";

interface Props {
  state: GameState;
  onStateChange: (patch: Partial<GameState>) => void;
  onContinue: () => void;
}

/** CSS-only Eiffel Tower silhouette built from divs */
function EiffelTower() {
  return (
    <div className="flex flex-col items-center gap-0" aria-hidden="true">
      {/* Antenna */}
      <div className="w-[2px] h-8 bg-gray-400" />
      {/* Top tier */}
      <div className="w-4 h-3" style={{ borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "12px solid #555" }} />
      {/* Upper body */}
      <div className="w-8 h-6 bg-[#444]" style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }} />
      {/* Mid arch */}
      <div className="w-12 h-4 bg-[#3a3a3a]" />
      {/* Lower body */}
      <div className="w-16 h-8 bg-[#333]" style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)" }} />
      {/* Legs */}
      <div className="flex gap-4">
        <div className="w-3 h-5 bg-[#2a2a2a]" style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }} />
        <div className="w-3 h-5 bg-[#2a2a2a]" style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }} />
      </div>
    </div>
  );
}

function ParisCard() {
  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-4 py-10 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a0808 60%, #0a0a0a 100%)",
        border: "3px solid #dc2626",
        boxShadow: "4px 4px 0px #7f1d1d",
        minHeight: "200px",
      }}
    >
      {/* Subtle red accent strip at bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{ backgroundColor: "#dc2626", opacity: 0.6 }}
      />
      {/* Stars / ambient dots */}
      <div className="absolute inset-0 pointer-events-none">
        {[10, 25, 40, 60, 75, 90, 15, 55, 80].map((left, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-gray-600"
            style={{ left: `${left}%`, top: `${10 + (i * 7) % 50}%` }}
          />
        ))}
      </div>

      <EiffelTower />

      <div className="flex flex-col items-center gap-1">
        <span
          className="text-red-400 text-[22px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          PARIS
        </span>
        <span className="text-gray-600 text-[12px] font-mono tracking-widest uppercase">
          Race 1 of 8
        </span>
      </div>
    </div>
  );
}

export default function ParisRaceScreen({ state, onStateChange, onContinue }: Props) {
  const [phase, setPhase] = useState<"setup" | "result">("setup");
  const [result, setResult] = useState<RaceResult | null>(null);

  function handleRunRace() {
    const r = runParisRace(state);
    setResult(r);
    setPhase("result");
  }

  return (
    <div className="relative z-20 px-6 max-w-2xl mx-auto flex flex-col items-center gap-8 py-16 w-full">

      {/* Header */}
      <div
        className="px-4 py-2 text-red-400 text-[17px] tracking-widest uppercase"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #dc2626",
          boxShadow: "4px 4px 0px #7f1d1d",
          backgroundColor: "#1c0a0a",
        }}
      >
        ▶ RACE 1 — PARIS
      </div>

      {phase === "setup" && (
        <>
          <ParisCard />

          <TeamStatusPanel state={state} />

          <RiskSelector
            value={state.riskWillingness}
            onChange={(v) => onStateChange({ riskWillingness: v })}
          />

          <button
            onClick={handleRunRace}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-[16px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
            style={{
              fontFamily: "var(--font-pixel), monospace",
              border: "3px solid #f87171",
              boxShadow: "4px 4px 0px #7f1d1d",
            }}
            type="button"
          >
            ▶ RUN PARIS RACE
          </button>
        </>
      )}

      {phase === "result" && result && (
        <RaceResultPanel result={result} onContinue={onContinue} />
      )}
    </div>
  );
}
