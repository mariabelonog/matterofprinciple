"use client";
import type { GameState } from "@/src/types/game";

interface Props {
  state: GameState;
}

function formatG(n: number): string {
  return (n / 1_000_000).toFixed(1) + "M G";
}

function StatBar({ value }: { value: number }) {
  // value is 0–10
  const pct = (value / 10) * 100;
  const color = value >= 7 ? "#22c55e" : value >= 4 ? "#f59e0b" : "#dc2626";
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-3 bg-[#1a1a1a]"
        style={{ border: "1px solid #333" }}
      >
        <div
          style={{ width: `${pct}%`, backgroundColor: color, height: "100%", transition: "width 0.2s" }}
        />
      </div>
      <span
        className="text-[13px] font-mono w-8 text-right"
        style={{ color }}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function TeamStatusPanel({ state }: Props) {
  return (
    <div
      className="w-full p-5 flex flex-col gap-4"
      style={{
        border: "3px solid #374151",
        boxShadow: "4px 4px 0px #111827",
        backgroundColor: "#111111",
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="text-amber-400 text-[14px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ■ {state.teamName || "—"}
        </span>
        <span
          className="text-green-400 text-[14px] tracking-widest font-mono"
        >
          {formatG(state.budget)}
        </span>
      </div>

      {/* Driver row */}
      {state.driver && (
        <div className="flex items-center justify-between text-[13px] font-mono gap-2">
          <span className="text-gray-400">DRIVER</span>
          <span className="text-white">{state.driver.name}</span>
        </div>
      )}

      {/* Stat bars */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-mono text-gray-400 tracking-widest uppercase">Car Development</span>
          <StatBar value={state.carDevelopment} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-mono text-gray-400 tracking-widest uppercase">Staff Quality</span>
          <StatBar value={state.staffQuality} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-mono text-gray-400 tracking-widest uppercase">Public Image</span>
          <StatBar value={state.publicImage} />
        </div>
      </div>
    </div>
  );
}
