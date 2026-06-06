"use client";
import type { RaceResult } from "@/src/types/game";

interface Props {
  result: RaceResult;
  onContinue: () => void;
}

function positionColor(pos: number): string {
  if (pos <= 3) return "#22c55e";
  if (pos <= 6) return "#f59e0b";
  return "#dc2626";
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-400 text-[13px] font-mono tracking-widest uppercase">{label}</span>
      <span className="text-white text-[14px] font-mono">{value.toFixed(3)}</span>
    </div>
  );
}

export default function RaceResultPanel({ result, onContinue }: Props) {
  const color = positionColor(result.position);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Position banner */}
      <div
        className="w-full flex flex-col items-center py-8 gap-2"
        style={{
          border: `3px solid ${color}`,
          boxShadow: `4px 4px 0px ${result.position <= 3 ? "#166534" : result.position <= 6 ? "#78350f" : "#7f1d1d"}`,
          backgroundColor: "#111111",
        }}
      >
        <span
          className="text-[56px] font-bold font-mono"
          style={{ color }}
        >
          P{result.position}
        </span>
        <span
          className="text-[14px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace", color }}
        >
          {result.position === 1 ? "VICTORY" : result.position <= 3 ? "PODIUM" : result.position <= 10 ? "POINTS" : "NO POINTS"}
        </span>
      </div>

      {/* Stats breakdown */}
      <div
        className="w-full p-5 flex flex-col gap-3"
        style={{
          border: "3px solid #374151",
          boxShadow: "4px 4px 0px #111827",
          backgroundColor: "#111111",
        }}
      >
        <span
          className="text-amber-400 text-[13px] tracking-widest uppercase mb-1"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ■ RACE BREAKDOWN
        </span>
        <StatRow label="Car Performance" value={result.carPerformance} />
        <StatRow label="Strategy" value={result.strategy} />
        <StatRow label="Driver Input" value={result.driverInput} />
        <div className="border-t border-[#333] my-1" />
        <StatRow label="Race Score" value={result.raceScore} />
      </div>

      {/* Narrative */}
      <div
        className="w-full p-5"
        style={{
          border: "3px solid #374151",
          boxShadow: "4px 4px 0px #111827",
          backgroundColor: "#0a0a0a",
        }}
      >
        <p className="text-gray-300 text-[15px] font-mono leading-relaxed">{result.narrative}</p>
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #f87171",
          boxShadow: "4px 4px 0px #7f1d1d",
        }}
        type="button"
      >
        CONTINUE TO STRASSBURG →
      </button>
    </div>
  );
}
