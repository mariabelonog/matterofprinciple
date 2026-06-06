"use client";

import { teamState, raceCalendar } from "@/data/mockData";

interface DashboardProps {
  teamName: string;
  onCrisisEvent: () => void;
  onEndSeason: () => void;
}

function indexColor(value: number): string {
  if (value >= 7) return "#22c55e";
  if (value >= 4) return "#f59e0b";
  return "#dc2626";
}

function formatG(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M G";
  return n.toLocaleString("en-US") + " G";
}

function IndexBar({ label, value }: { label: string; value: number }) {
  const color = indexColor(value);
  const pct = (value / 10) * 100;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span
          className="text-gray-400 text-[15px] tracking-widest"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          {label}
        </span>
        <span
          className="text-[16px]"
          style={{ fontFamily: "var(--font-pixel), monospace", color }}
        >
          {value.toFixed(1)}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-800" style={{ border: "1px solid #374151" }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function Dashboard({ teamName, onCrisisEvent, onEndSeason }: DashboardProps) {
  const { budget, carDevelopment, staffQuality, publicImage, driverIndex, riskWillingness, currentRace } = teamState;

  // Derived indices per spec formulas
  const carPerformance = carDevelopment * 0.6 + staffQuality * 0.4;
  const strategy = staffQuality * 0.7 + riskWillingness * 0.3;
  const driverInput = driverIndex * 0.6 + riskWillingness * 0.4;
  const raceScore = carPerformance * 0.6 + driverInput * 0.1 + strategy * 0.3;

  // Sponsor probability
  const sponsorProbability = ((publicImage / 10) * 100).toFixed(0);

  // Crash probability
  const crashProbability = ((riskWillingness / 20) * 100).toFixed(0);

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
          {teamName.toUpperCase()} · SEASON 01
        </span>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Core Indices */}
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
            ■ CORE INDICES
          </h3>

          {/* Budget */}
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
              {formatG(budget)}
            </span>
          </div>

          <IndexBar label="CAR DEVELOPMENT" value={carDevelopment} />
          <IndexBar label="STAFF QUALITY" value={staffQuality} />
          <IndexBar label="PUBLIC IMAGE" value={publicImage} />
          <IndexBar label="DRIVER INDEX" value={driverIndex} />

          {/* Risk willingness — shown with inverted colour logic */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span
                className="text-gray-400 text-[15px] tracking-widest"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                RISK WILLINGNESS
              </span>
              <span
                className="text-[16px]"
                style={{
                  fontFamily: "var(--font-pixel), monospace",
                  color: riskWillingness >= 7 ? "#dc2626" : riskWillingness >= 4 ? "#f59e0b" : "#22c55e",
                }}
              >
                {riskWillingness}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-800" style={{ border: "1px solid #374151" }}>
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(riskWillingness / 10) * 100}%`,
                  backgroundColor: riskWillingness >= 7 ? "#dc2626" : riskWillingness >= 4 ? "#f59e0b" : "#22c55e",
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Race Projections */}
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
            ■ RACE PROJECTIONS
          </h3>

          {/* Derived indices */}
          {(
            [
              { label: "CAR PERFORMANCE", value: carPerformance },
              { label: "STRATEGY",        value: strategy },
              { label: "DRIVER INPUT",    value: driverInput },
            ] as Array<{ label: string; value: number }>
          ).map(({ label, value }, i) => (
            <div key={i}>
              <IndexBar label={label} value={parseFloat(value.toFixed(1))} />
            </div>
          ))}

          {/* Race score — prominent */}
          <div
            className="flex items-center justify-between px-4 py-3 mt-1"
            style={{
              border: "3px solid #dc2626",
              boxShadow: "4px 4px 0px #7f1d1d",
              backgroundColor: "#1c0a0a",
            }}
          >
            <span
              className="text-red-400 text-[15px] tracking-widest"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              RACE SCORE
            </span>
            <span
              className="text-white text-[20px]"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              {raceScore.toFixed(2)}
            </span>
          </div>

          {/* Sponsor & crash probabilities */}
          <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <span
                className="text-gray-400 text-[14px] tracking-widest"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                SPONSOR CHANCE
              </span>
              <span
                className="text-green-400 text-[15px]"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                {sponsorProbability}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className="text-gray-400 text-[14px] tracking-widest"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                CRASH RISK
              </span>
              <span
                className={`text-[15px] ${parseInt(crashProbability) >= 30 ? "text-red-400" : "text-amber-400"}`}
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                {crashProbability}%
              </span>
            </div>
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
          {raceCalendar.map((race) => {
            const isNext = race.round === currentRace;
            const isCompleted = race.round < currentRace;
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
                }}
              >
                <span
                  className="text-[15px]"
                  style={{ fontFamily: "var(--font-pixel), monospace", color: textColor }}
                >
                  R{race.round}
                </span>
                <span
                  className="text-[13px] text-center leading-tight font-mono"
                  style={{ color: textColor }}
                >
                  {race.city}
                </span>
                {race.isCrisis && (
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: "var(--font-pixel), monospace", color: isCompleted ? "#4ade80" : isNext ? "#f59e0b" : "#4b5563" }}
                  >
                    ⚠
                  </span>
                )}
                {isCompleted && <span className="text-green-500 text-[16px]">✓</span>}
                {isNext && <span className="text-red-400 text-[16px]">▶</span>}
              </div>
            );
          })}
        </div>
        <p
          className="text-gray-700 text-[13px] font-mono mt-2"
        >
          ⚠ = crisis race
        </p>
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
