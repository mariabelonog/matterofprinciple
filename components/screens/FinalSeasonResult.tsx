"use client";

import type { GameState, ExtendedRaceResult } from "@/types/game";

interface Props {
  state: GameState;
  raceHistory: ExtendedRaceResult[];
  onPlayAgain: () => void;
}

function positionBadgeColor(pos: number): string {
  if (pos <= 3) return "#22c55e";
  if (pos <= 6) return "#f59e0b";
  return "#dc2626";
}

type Outcome = "LEGENDARY COMEBACK" | "SUCCESSFUL RECOVERY" | "TEAM STABILIZED" | "TEAM BANKRUPT" | "CRISIS CONTINUES";

function calcOutcome(avgPos: number, publicImage: number, budget: number): Outcome {
  if (budget < 0) return "TEAM BANKRUPT";
  if (avgPos <= 3.5 && budget >= 0) return "LEGENDARY COMEBACK";
  if (avgPos <= 5 && publicImage >= 5 && budget >= 0) return "SUCCESSFUL RECOVERY";
  if (avgPos <= 6.5 && budget >= 0) return "TEAM STABILIZED";
  return "CRISIS CONTINUES";
}

function outcomeColor(outcome: Outcome): string {
  switch (outcome) {
    case "LEGENDARY COMEBACK":  return "#22c55e";
    case "SUCCESSFUL RECOVERY": return "#22c55e";
    case "TEAM STABILIZED":     return "#f59e0b";
    case "TEAM BANKRUPT":       return "#dc2626";
    case "CRISIS CONTINUES":    return "#f87171";
  }
}

function outcomeShadow(outcome: Outcome): string {
  switch (outcome) {
    case "LEGENDARY COMEBACK":
    case "SUCCESSFUL RECOVERY": return "#052e16";
    case "TEAM STABILIZED":     return "#78350f";
    case "TEAM BANKRUPT":
    case "CRISIS CONTINUES":    return "#7f1d1d";
  }
}

function outcomeNarrative(outcome: Outcome, state: GameState): string {
  switch (outcome) {
    case "LEGENDARY COMEBACK":
      return `An extraordinary season for ${state.teamName}. Against all odds, you dominated the field and finished near the top consistently. The paddock is talking. The board is delighted.`;
    case "SUCCESSFUL RECOVERY":
      return `${state.teamName} turned a crisis into a statement. Your principled management and growing public image attracted enough support to make this a season to remember.`;
    case "TEAM STABILIZED":
      return `A grinding but ultimately successful season. ${state.teamName} kept the wheels on and avoided catastrophe. The foundation is built for something better.`;
    case "TEAM BANKRUPT":
      return `The finances could not hold. ${state.teamName} enters administration. Every principle survives — but the team itself does not. Perhaps next time the principles will come with better cash flow.`;
    case "CRISIS CONTINUES":
      return `${state.teamName} limps into the off-season battered and bruised. The board is restless, the paddock unconvinced. Another difficult year lies ahead.`;
  }
}

export default function FinalSeasonResult({ state, raceHistory, onPlayAgain }: Props) {
  const positions = raceHistory.map((r) => r.position);
  const avgPosition = positions.length > 0
    ? positions.reduce((a, b) => a + b, 0) / positions.length
    : 10;
  const bestPosition = positions.length > 0 ? Math.min(...positions) : 10;
  const worstPosition = positions.length > 0 ? Math.max(...positions) : 10;

  const outcome = calcOutcome(avgPosition, state.publicImage, state.budget);
  const color = outcomeColor(outcome);
  const shadow = outcomeShadow(outcome);
  const narrative = outcomeNarrative(outcome, state);

  return (
    <div className="relative z-20 px-6 max-w-2xl mx-auto flex flex-col items-center gap-8 py-16 w-full">
      {/* Header */}
      <div
        className="px-4 py-2 text-red-400 text-[17px] tracking-widest uppercase"
        style={{ fontFamily: "var(--font-pixel), monospace", border: "3px solid #dc2626", boxShadow: "4px 4px 0px #7f1d1d", backgroundColor: "#1c0a0a" }}
      >
        ▶ SEASON COMPLETE
      </div>

      {/* Outcome banner */}
      <div
        className="w-full flex flex-col items-center py-8 gap-3"
        style={{ border: `3px solid ${color}`, boxShadow: `4px 4px 0px ${shadow}`, backgroundColor: "#111111" }}
      >
        <span
          className="text-[13px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace", color: "#6b7280" }}
        >
          {state.teamName}
        </span>
        <span
          className="text-[24px] tracking-widest uppercase text-center"
          style={{ fontFamily: "var(--font-pixel), monospace", color }}
        >
          {outcome}
        </span>
      </div>

      {/* Stats grid */}
      <div
        className="w-full p-5 grid grid-cols-2 gap-4"
        style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#111111" }}
      >
        <span
          className="col-span-2 text-amber-400 text-[13px] tracking-widest uppercase mb-1"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ■ SEASON STATISTICS
        </span>

        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-[11px] font-mono uppercase tracking-widest">AVG POSITION</span>
          <span className="text-white text-[20px] font-mono font-bold">{avgPosition.toFixed(1)}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-[11px] font-mono uppercase tracking-widest">BEST RESULT</span>
          <span className="text-[20px] font-mono font-bold" style={{ color: positionBadgeColor(bestPosition) }}>
            P{bestPosition}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-[11px] font-mono uppercase tracking-widest">WORST RESULT</span>
          <span className="text-[20px] font-mono font-bold" style={{ color: positionBadgeColor(worstPosition) }}>
            P{worstPosition}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-[11px] font-mono uppercase tracking-widest">FINAL BUDGET</span>
          <span
            className="text-[20px] font-mono font-bold"
            style={{ color: state.budget >= 0 ? "#22c55e" : "#dc2626" }}
          >
            {(state.budget / 1_000_000).toFixed(1)}M G
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-[11px] font-mono uppercase tracking-widest">PUBLIC IMAGE</span>
          <span
            className="text-[20px] font-mono font-bold"
            style={{ color: state.publicImage >= 6 ? "#22c55e" : state.publicImage >= 3 ? "#f59e0b" : "#dc2626" }}
          >
            {state.publicImage.toFixed(1)} / 10
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-[11px] font-mono uppercase tracking-widest">RACES COMPLETED</span>
          <span className="text-white text-[20px] font-mono font-bold">{raceHistory.length} / 8</span>
        </div>
      </div>

      {/* Race history row */}
      {raceHistory.length > 0 && (
        <div
          className="w-full p-5 flex flex-col gap-3"
          style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#111111" }}
        >
          <span
            className="text-amber-400 text-[13px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            ■ RACE HISTORY
          </span>
          <div className="flex flex-wrap gap-2">
            {raceHistory.map((r) => (
              <div
                key={r.raceNumber}
                className="flex flex-col items-center gap-1 p-2 min-w-[50px]"
                style={{
                  border: `2px solid ${positionBadgeColor(r.position)}`,
                  backgroundColor: "#0a0a0a",
                }}
              >
                <span className="text-gray-600 text-[10px] font-mono uppercase">{r.city.slice(0, 3)}</span>
                <span
                  className="text-[16px] font-mono font-bold"
                  style={{ color: positionBadgeColor(r.position) }}
                >
                  P{r.position}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Narrative */}
      <div
        className="w-full p-5"
        style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#0a0a0a" }}
      >
        <p className="text-gray-300 text-[15px] font-mono leading-relaxed">{narrative}</p>
      </div>

      {/* Play again */}
      <button
        onClick={onPlayAgain}
        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
        style={{ fontFamily: "var(--font-pixel), monospace", border: "3px solid #f87171", boxShadow: "4px 4px 0px #7f1d1d" }}
        type="button"
      >
        ▶ PLAY AGAIN
      </button>
    </div>
  );
}
