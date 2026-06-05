"use client";

import { teamStats, budgetCategories, mockRaceCalendar } from "@/data/mockData";

interface DashboardProps {
  onCrisisEvent: () => void;
  onEndSeason: () => void;
}

// Returns a Tailwind-compatible color class and hex for the stat bar fill.
function statBarColor(value: number, isRisk = false): string {
  if (isRisk) {
    // For risk, high value = bad
    if (value >= 70) return "#dc2626";
    if (value >= 40) return "#f59e0b";
    return "#22c55e";
  }
  if (value >= 60) return "#22c55e";
  if (value >= 35) return "#f59e0b";
  return "#dc2626";
}

function formatBudget(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export default function Dashboard({ onCrisisEvent, onEndSeason }: DashboardProps) {
  const totalAllocated = budgetCategories.reduce((sum, c) => sum + c.allocated, 0);

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-4 py-10 flex flex-col gap-6">

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2
          className="text-white text-[17px] tracking-widest"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          DASHBOARD
        </h2>
        <span
          className="text-red-400 text-[16px] tracking-widest px-3 py-1"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            border: "3px solid #dc2626",
            boxShadow: "4px 4px 0px #7f1d1d",
            backgroundColor: "#1c0a0a",
          }}
        >
          VORTEX MOTORSPORT · SEASON 01
        </span>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Team Status */}
        <div
          className="p-5 flex flex-col gap-4"
          style={{
            border: "3px solid #374151",
            boxShadow: "4px 4px 0px #111827",
            backgroundColor: "#111111",
          }}
        >
          <h3
            className="text-amber-400 text-[17px] tracking-widest mb-1"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            ■ TEAM STATUS
          </h3>

          {/* Budget — shown as large currency figure */}
          <div className="flex items-center justify-between py-2 border-b border-gray-800">
            <span
              className="text-gray-400 text-[16px] tracking-widest"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              BUDGET
            </span>
            <span
              className="text-green-400 text-[16px]"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              {formatBudget(teamStats.budget)}
            </span>
          </div>

          {/* Stat rows */}
          {(
            [
              { label: "CAR PERF", value: teamStats.carPerformance, isRisk: false },
              { label: "DRV MORALE", value: teamStats.driverMorale, isRisk: false },
              { label: "STAFF QUAL", value: teamStats.staffQuality, isRisk: false },
              { label: "REPUTATION", value: teamStats.reputation, isRisk: false },
              { label: "RISK LEVEL", value: teamStats.risk, isRisk: true },
            ] as { label: string; value: number; isRisk: boolean }[]
          ).map((stat) => {
            const color = statBarColor(stat.value, stat.isRisk);
            return (
              <div key={stat.label} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span
                    className="text-gray-400 text-[15px] tracking-widest"
                    style={{ fontFamily: "var(--font-pixel), monospace" }}
                  >
                    {stat.label}
                  </span>
                  <span
                    className="text-[16px]"
                    style={{ fontFamily: "var(--font-pixel), monospace", color }}
                  >
                    {stat.value}
                  </span>
                </div>
                {/* Progress bar track */}
                <div className="w-full h-2 bg-gray-800" style={{ border: "1px solid #374151" }}>
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${stat.value}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Budget Allocation */}
        <div
          className="p-5 flex flex-col gap-4"
          style={{
            border: "3px solid #374151",
            boxShadow: "4px 4px 0px #111827",
            backgroundColor: "#111111",
          }}
        >
          <h3
            className="text-amber-400 text-[17px] tracking-widest mb-1"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            ■ BUDGET ALLOCATION
          </h3>

          {budgetCategories.map((cat) => (
            <div key={cat.id} className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span
                  className="text-[15px] tracking-widest"
                  style={{ fontFamily: "var(--font-pixel), monospace", color: cat.color }}
                >
                  {cat.label.toUpperCase()}
                </span>
                <span
                  className="text-gray-300 text-[16px]"
                  style={{ fontFamily: "var(--font-pixel), monospace" }}
                >
                  {cat.allocated}%
                </span>
              </div>
              {/* Thin category bar */}
              <div className="w-full h-1.5 bg-gray-800" style={{ border: "1px solid #374151" }}>
                <div
                  className="h-full"
                  style={{ width: `${cat.allocated}%`, backgroundColor: cat.color }}
                />
              </div>
              <p className="text-gray-600 text-[14px] font-mono leading-snug">{cat.description}</p>
            </div>
          ))}

          {/* Total */}
          <div
            className="flex justify-between items-center mt-2 pt-3 border-t border-gray-700"
          >
            <span
              className="text-gray-400 text-[15px] tracking-widest"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              TOTAL ALLOCATED
            </span>
            <span
              className={`text-[17px] ${totalAllocated === 100 ? "text-green-400" : "text-red-400"}`}
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              {totalAllocated}%
            </span>
          </div>
        </div>
      </div>

      {/* Race calendar strip */}
      <div
        className="p-4"
        style={{
          border: "3px solid #374151",
          boxShadow: "4px 4px 0px #111827",
          backgroundColor: "#111111",
        }}
      >
        <h3
          className="text-amber-400 text-[16px] tracking-widest mb-3"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ■ RACE CALENDAR
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {mockRaceCalendar.map((race) => {
            const isNext = race.status === "next";
            const isCompleted = race.status === "completed";
            const borderColor = isCompleted ? "#16a34a" : isNext ? "#dc2626" : "#374151";
            const bgColor = isCompleted ? "#052e16" : isNext ? "#1c0a0a" : "#0a0a0a";
            const textColor = isCompleted ? "#4ade80" : isNext ? "#f87171" : "#4b5563";

            return (
              <div
                key={race.round}
                className="flex flex-col items-center gap-1 p-2"
                style={{
                  border: `3px solid ${borderColor}`,
                  boxShadow: `2px 2px 0px ${isNext ? "#7f1d1d" : "#111"}`,
                  backgroundColor: bgColor,
                  // Blinking effect for next race via inline animation placeholder
                  animation: isNext ? "pulse 1s step-start infinite" : undefined,
                }}
              >
                <span
                  className="text-[15px]"
                  style={{ fontFamily: "var(--font-pixel), monospace", color: textColor }}
                >
                  R{race.round}
                </span>
                <span
                  className="text-[14px] text-center leading-tight font-mono"
                  style={{ color: textColor }}
                >
                  {race.location}
                </span>
                {isCompleted && (
                  <span className="text-green-500 text-[16px]">✓</span>
                )}
                {isNext && (
                  <span className="text-red-400 text-[16px]">▶</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          onClick={onCrisisEvent}
          className="px-6 py-4 text-amber-400 hover:bg-amber-950 text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            border: "3px solid #f59e0b",
            boxShadow: "4px 4px 0px #78350f",
            backgroundColor: "#1c1000",
          }}
          type="button"
        >
          ⚠ CRISIS EVENT
        </button>
        <button
          onClick={onEndSeason}
          className="px-6 py-4 bg-red-600 hover:bg-red-500 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            border: "3px solid #f87171",
            boxShadow: "4px 4px 0px #7f1d1d",
          }}
          type="button"
        >
          END SEASON →
        </button>
      </div>
    </div>
  );
}
