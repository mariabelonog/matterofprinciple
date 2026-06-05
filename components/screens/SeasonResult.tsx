"use client";

import { seasonResult } from "@/data/mockData";

interface SeasonResultProps {
  onRestart: () => void;
  onNextSeason: () => void;
  result: typeof seasonResult;
}

function formatBudget(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export default function SeasonResult({ onRestart, onNextSeason, result }: SeasonResultProps) {
  const isSurvived = result.outcome === "survived";
  const isBankrupt = result.outcome === "bankrupt";
  const isAcquired = result.outcome === "acquired";

  const outcomeLabel = isSurvived
    ? "SEASON SURVIVED"
    : isBankrupt
    ? "TEAM BANKRUPT"
    : "TEAM ACQUIRED";

  const outcomeColor = isSurvived ? "#22c55e" : isBankrupt ? "#dc2626" : "#f59e0b";
  const outcomeBorder = isSurvived ? "#16a34a" : isBankrupt ? "#991b1b" : "#d97706";
  const outcomeShadow = isSurvived ? "#052e16" : isBankrupt ? "#450a0a" : "#451a03";

  const canContinue = isSurvived;

  const recapStats = [
    { label: "RACES\nCOMPLETED", value: String(result.stats.racesCompleted) },
    { label: "TOTAL\nPOINTS", value: String(result.stats.points) },
    { label: "BUDGET\nREMAINING", value: formatBudget(result.stats.budgetRemaining) },
    { label: "FINAL\nMORALE", value: String(result.stats.moraleFinal) },
  ];

  return (
    <div className="relative z-20 w-full max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-8">

      {/* Outcome banner */}
      <div
        className="w-full text-center px-6 py-5"
        style={{
          border: `3px solid ${outcomeBorder}`,
          boxShadow: `4px 4px 0px ${outcomeShadow}`,
          backgroundColor: "#111111",
        }}
      >
        <h2
          className="leading-snug"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            fontSize: "clamp(0.9rem, 3.5vw, 1.4rem)",
            color: outcomeColor,
          }}
        >
          {outcomeLabel}
        </h2>
      </div>

      {/* Stat recap boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {recapStats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 p-4"
            style={{
              border: "3px solid #374151",
              boxShadow: "4px 4px 0px #111827",
              backgroundColor: "#111111",
            }}
          >
            <span
              className="text-gray-500 text-[15px] tracking-widest text-center whitespace-pre-line leading-relaxed"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              {stat.label}
            </span>
            <span
              className="text-white text-[17px]"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Summary text */}
      <div
        className="w-full p-5"
        style={{
          border: "3px solid #374151",
          boxShadow: "4px 4px 0px #111827",
          backgroundColor: "#111111",
        }}
      >
        <p className="text-gray-300 text-[16px] leading-relaxed font-mono text-center">
          {result.summary}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-transparent hover:bg-gray-800 text-gray-300 text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            border: "3px solid #4b5563",
            boxShadow: "4px 4px 0px #1f2937",
          }}
          type="button"
        >
          PLAY AGAIN
        </button>
        <button
          onClick={canContinue ? onNextSeason : undefined}
          disabled={!canContinue}
          className={`px-8 py-4 text-[14px] tracking-widest uppercase transition-colors duration-100 ${
            canContinue
              ? "bg-red-600 hover:bg-red-500 text-white cursor-pointer active:translate-y-[2px]"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
          style={{
            fontFamily: "var(--font-pixel), monospace",
            border: canContinue ? "3px solid #f87171" : "3px solid #374151",
            boxShadow: canContinue ? "4px 4px 0px #7f1d1d" : "4px 4px 0px #111827",
          }}
          type="button"
        >
          NEXT SEASON →
        </button>
      </div>
    </div>
  );
}
