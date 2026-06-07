"use client";

import { useState } from "react";
import type { Race, GameState, ExtendedRaceResult, CrisisChoice } from "@/types/game";
import { CRISIS_EVENTS } from "@/lib/crisisEvents";
import { runRace, rollSponsor, rollCrash, buildRaceNarrative } from "@/lib/simulation";
import TeamStatusPanel from "@/components/ui/TeamStatusPanel";
import RiskSelector from "@/components/ui/RiskSelector";
import SponsorUpdate from "@/components/ui/SponsorUpdate";
import CrisisPanel from "@/components/ui/CrisisPanel";

interface Props {
  race: Race;
  state: GameState;
  onStateChange: (patch: Partial<GameState>) => void;
  onRaceComplete: (result: ExtendedRaceResult) => void;
  onContinue: () => void; // called when user clicks continue after seeing result
}

type Phase = "sponsor" | "crisis" | "setup" | "result";

// ─── Orient Express route strip ──────────────────────────────────────────────

const ROUTE = ["Paris","Strassburg","Stuttgart","Vienna","Budapest","Bucharest","Sinaia","Istanbul"];

function OrientExpressRoute({ currentRound }: { currentRound: number }) {
  return (
    <div
      className="w-full p-4 flex flex-col gap-3"
      style={{ border: "3px solid #78350f", boxShadow: "4px 4px 0px #1c1000", backgroundColor: "#0a0600" }}
    >
      {/* Label */}
      <div className="flex items-center gap-2">
        <span
          className="text-amber-600 text-[11px] tracking-[0.25em] uppercase"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ▶ ORIENT EXPRESS CIRCUIT
        </span>
        <div className="flex-1 h-[1px] bg-amber-900 opacity-40" />
        <span className="text-amber-900 text-[11px] font-mono">SEASON 01</span>
      </div>

      {/* Track line with station dots */}
      <div className="relative flex items-center w-full" style={{ height: "48px" }}>
        {/* Continuous rail line */}
        <div
          className="absolute w-full"
          style={{ top: "16px", height: "2px", backgroundColor: "#3d2408" }}
        />
        {/* Completed portion */}
        <div
          className="absolute"
          style={{
            top: "16px",
            height: "2px",
            left: 0,
            width: `${((currentRound - 1) / 7) * 100}%`,
            backgroundColor: "#92400e",
          }}
        />

        {/* Station dots */}
        {ROUTE.map((city, i) => {
          const round = i + 1;
          const isDone = round < currentRound;
          const isCurrent = round === currentRound;
          const pct = (i / 7) * 100;
          const dotColor = isDone ? "#92400e" : isCurrent ? "#f59e0b" : "#3d2408";
          const textColor = isDone ? "#78350f" : isCurrent ? "#f59e0b" : "#44331a";

          return (
            <div
              key={city}
              className="absolute flex flex-col items-center"
              style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
            >
              {/* Dot */}
              <div
                style={{
                  width: isCurrent ? "10px" : "6px",
                  height: isCurrent ? "10px" : "6px",
                  backgroundColor: dotColor,
                  border: isCurrent ? "2px solid #f59e0b" : "1px solid #3d2408",
                  borderRadius: "0",
                  marginBottom: "4px",
                  boxShadow: isCurrent ? "0 0 6px #f59e0b88" : "none",
                }}
              />
              {/* City label */}
              <span
                className="text-[9px] font-mono text-center leading-tight"
                style={{
                  color: textColor,
                  maxWidth: "36px",
                  wordBreak: "break-word",
                  fontWeight: isCurrent ? "bold" : "normal",
                }}
              >
                {city.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── City card silhouettes ────────────────────────────────────────────────────

function EiffelTower() {
  return (
    <div className="flex flex-col items-center gap-0" aria-hidden="true">
      <div className="w-[2px] h-8 bg-gray-400" />
      <div className="w-4 h-3" style={{ borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "12px solid #555" }} />
      <div className="w-8 h-6 bg-[#444]" style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }} />
      <div className="w-12 h-4 bg-[#3a3a3a]" />
      <div className="w-16 h-8 bg-[#333]" style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)" }} />
      <div className="flex gap-4">
        <div className="w-3 h-5 bg-[#2a2a2a]" style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }} />
        <div className="w-3 h-5 bg-[#2a2a2a]" style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }} />
      </div>
    </div>
  );
}

// Strassburg: pointed cathedral arch silhouette
function StrassburgSilhouette() {
  return (
    <div className="flex flex-col items-center gap-0" aria-hidden="true">
      {/* Spire */}
      <div className="w-[3px] h-10 bg-[#5a6a7a]" />
      {/* Upper tower body */}
      <div className="w-6 h-8 bg-[#3a4a5a]" />
      {/* Gothic arch */}
      <div
        className="w-14 h-10 bg-[#2a3a4a]"
        style={{ borderRadius: "50% 50% 0 0 / 80% 80% 0 0" }}
      />
      {/* Lower walls */}
      <div className="flex gap-1 items-end">
        <div className="w-8 h-12 bg-[#243040]" />
        <div className="w-4 h-8 bg-[#1e2a38]" />
        <div className="w-8 h-14 bg-[#243040]" />
      </div>
    </div>
  );
}

// Stuttgart: factory chimney silhouettes, industrial
function StuttgartSilhouette() {
  return (
    <div className="flex items-end gap-2" aria-hidden="true" style={{ height: "100px" }}>
      <div className="w-6 h-20 bg-[#2a2a2a]" />
      <div className="w-3 h-16 bg-[#333]" />
      <div className="w-8 h-24 bg-[#222]" />
      <div className="w-3 h-12 bg-[#2a2a2a]" />
      <div className="w-6 h-18 bg-[#333]" />
      {/* Smoke hints */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 opacity-20">
        <div className="w-2 h-2 bg-[#f59e0b] rounded-full" />
        <div className="w-2 h-2 bg-[#f59e0b] rounded-full" />
      </div>
    </div>
  );
}

// Vienna: dome silhouette (circle on top of rectangle)
function ViennaSilhouette() {
  return (
    <div className="flex flex-col items-center gap-0" aria-hidden="true">
      {/* Finial */}
      <div className="w-[2px] h-4 bg-[#7a6a9a]" />
      {/* Dome */}
      <div
        className="w-20 h-12 bg-[#4a3a6a]"
        style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
      />
      {/* Drum */}
      <div className="w-16 h-4 bg-[#3a2a5a]" />
      {/* Building body */}
      <div className="w-24 h-12 bg-[#2a1a4a]" />
      {/* Columns hint */}
      <div className="flex gap-2">
        {[0,1,2,3].map(i => (
          <div key={i} className="w-[3px] h-4 bg-[#3a2a5a]" />
        ))}
      </div>
    </div>
  );
}

// Budapest: bridge cable silhouette — two towers with cables
function BudapestSilhouette() {
  return (
    <div className="flex flex-col items-center gap-0 w-full" aria-hidden="true">
      {/* Bridge towers */}
      <div className="flex items-end justify-center gap-16 w-full">
        <div className="flex flex-col items-center">
          <div className="w-[2px] h-4 bg-[#2a6a6a]" />
          <div className="w-4 h-16 bg-[#1a4a5a]" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-[2px] h-4 bg-[#2a6a6a]" />
          <div className="w-4 h-16 bg-[#1a4a5a]" />
        </div>
      </div>
      {/* Deck */}
      <div className="w-full h-2 bg-[#152a3a]" />
      {/* River strip */}
      <div className="w-full h-3 bg-[#0a1a2a] opacity-70" />
    </div>
  );
}

// Bucharest: wide boulevard feel, muted amber columns
function BucharestSilhouette() {
  return (
    <div className="flex items-end justify-center gap-1 w-full" aria-hidden="true" style={{ height: "90px" }}>
      <div className="w-10 h-14 bg-[#2a2520]" />
      <div className="w-6 h-10 bg-[#222018]" />
      <div className="w-16 h-20 bg-[#2e2820]" style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)" }} />
      <div className="w-6 h-10 bg-[#222018]" />
      <div className="w-10 h-14 bg-[#2a2520]" />
    </div>
  );
}

// Sinaia: mountain triangle + castle tower
function SinaiaSilhouette() {
  return (
    <div className="flex flex-col items-center gap-0" aria-hidden="true">
      {/* Castle tower */}
      <div className="flex gap-1 mb-0">
        <div className="w-2 h-3 bg-[#1a2a1a]" />
        <div className="w-2 h-3 bg-[#1a2a1a]" />
        <div className="w-2 h-3 bg-[#1a2a1a]" />
      </div>
      <div className="w-10 h-8 bg-[#1e2e1e]" />
      {/* Mountain peak */}
      <div
        className="w-0 h-0"
        style={{
          borderLeft: "40px solid transparent",
          borderRight: "40px solid transparent",
          borderBottom: "50px solid #162416",
        }}
      />
      <div
        className="w-0 h-0"
        style={{
          borderLeft: "70px solid transparent",
          borderRight: "70px solid transparent",
          borderBottom: "40px solid #0e1a0e",
        }}
      />
    </div>
  );
}

// Istanbul: bridge cables + dome on horizon
function IstanbulSilhouette() {
  return (
    <div className="flex flex-col items-center gap-1 w-full" aria-hidden="true">
      {/* Dome + minaret */}
      <div className="flex items-end gap-3 justify-center mb-1">
        <div className="flex flex-col items-center">
          <div className="w-[2px] h-6 bg-[#3a3a6a]" />
          <div className="w-2 h-3 bg-[#2a2a5a]" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-8 bg-[#2a2a5a]" style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
          <div className="w-14 h-4 bg-[#222248]" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-[2px] h-6 bg-[#3a3a6a]" />
          <div className="w-2 h-3 bg-[#2a2a5a]" />
        </div>
      </div>
      {/* Bridge */}
      <div className="flex items-end justify-center gap-10 w-full">
        <div className="w-3 h-10 bg-[#1a1a4a]" />
        <div className="w-3 h-10 bg-[#1a1a4a]" />
      </div>
      <div className="w-full h-2 bg-[#111130]" />
    </div>
  );
}

// City card container
function CityCard({ race }: { race: Race }) {
  const configs: Record<string, { bg: string; accent: string; label: string }> = {
    Paris:     { bg: "linear-gradient(180deg, #0a0a0a 0%, #1a0808 60%, #0a0a0a 100%)", accent: "#dc2626", label: "text-red-400" },
    Strassburg:{ bg: "linear-gradient(180deg, #080a10 0%, #0a1018 60%, #080a10 100%)", accent: "#4a6a8a", label: "text-blue-300" },
    Stuttgart: { bg: "linear-gradient(180deg, #0a0a08 0%, #181408 60%, #0a0a08 100%)", accent: "#f59e0b", label: "text-amber-400" },
    Vienna:    { bg: "linear-gradient(180deg, #08080e 0%, #120a18 60%, #08080e 100%)", accent: "#7c3aed", label: "text-purple-400" },
    Budapest:  { bg: "linear-gradient(180deg, #08100e 0%, #081218 60%, #08100e 100%)", accent: "#0d9488", label: "text-teal-400" },
    Bucharest: { bg: "linear-gradient(180deg, #0a0a08 0%, #141008 60%, #0a0a08 100%)", accent: "#92400e", label: "text-amber-600" },
    Sinaia:    { bg: "linear-gradient(180deg, #08100a 0%, #081408 60%, #08100a 100%)", accent: "#16a34a", label: "text-green-400" },
    Istanbul:  { bg: "linear-gradient(180deg, #080810 0%, #0a0814 60%, #080810 100%)", accent: "#3730a3", label: "text-indigo-400" },
  };

  const cfg = configs[race.city] ?? configs["Paris"];

  function Silhouette() {
    switch (race.city) {
      case "Paris":      return <EiffelTower />;
      case "Strassburg": return <StrassburgSilhouette />;
      case "Stuttgart":  return <StuttgartSilhouette />;
      case "Vienna":     return <ViennaSilhouette />;
      case "Budapest":   return <BudapestSilhouette />;
      case "Bucharest":  return <BucharestSilhouette />;
      case "Sinaia":     return <SinaiaSilhouette />;
      case "Istanbul":   return <IstanbulSilhouette />;
      default:           return null;
    }
  }

  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-4 py-10 relative overflow-hidden"
      style={{
        background: cfg.bg,
        border: `3px solid ${cfg.accent}`,
        boxShadow: "4px 4px 0px #111",
        minHeight: "200px",
      }}
    >
      <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: cfg.accent, opacity: 0.6 }} />
      {/* Ambient dots */}
      <div className="absolute inset-0 pointer-events-none">
        {[10, 25, 40, 60, 75, 90, 15, 55, 80].map((left, i) => (
          <div key={i} className="absolute w-[2px] h-[2px] bg-gray-600" style={{ left: `${left}%`, top: `${10 + (i * 7) % 50}%` }} />
        ))}
      </div>

      <Silhouette />

      <div className="flex flex-col items-center gap-1">
        <span
          className={`${cfg.label} text-[22px] tracking-[0.3em] uppercase`}
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          {race.city.toUpperCase()}
        </span>
        <span className="text-gray-600 text-[12px] font-mono tracking-widest uppercase">
          Race {race.round} of 8
        </span>
        <span className="text-gray-500 text-[12px] font-mono text-center max-w-[280px] mt-1">
          {race.atmosphereText}
        </span>
      </div>
    </div>
  );
}

// ─── Result panel (extended) ──────────────────────────────────────────────────

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

interface ResultPanelProps {
  result: ExtendedRaceResult;
  nextCity: string | null; // null means final race
  onContinue: () => void;
}

function ExtendedResultPanel({ result, nextCity, onContinue }: ResultPanelProps) {
  const color = positionColor(result.position);
  const posLabel = result.position === 1 ? "VICTORY" : result.position <= 3 ? "PODIUM" : "FINISH";
  const shadowColor = result.position <= 3 ? "#166534" : result.position <= 6 ? "#78350f" : "#7f1d1d";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Position banner */}
      <div
        className="w-full flex flex-col items-center py-8 gap-2"
        style={{ border: `3px solid ${color}`, boxShadow: `4px 4px 0px ${shadowColor}`, backgroundColor: "#111111" }}
      >
        <span className="text-[56px] font-bold font-mono" style={{ color }}>P{result.position}</span>
        <span className="text-[14px] tracking-widest uppercase" style={{ fontFamily: "var(--font-pixel), monospace", color }}>
          {posLabel}
        </span>
      </div>

      {/* Finance summary */}
      {(result.sponsorIncome > 0 || result.crashLosses > 0) && (
        <div
          className="w-full p-4 flex flex-col gap-2"
          style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#111111" }}
        >
          <span className="text-amber-400 text-[12px] tracking-widest uppercase mb-1" style={{ fontFamily: "var(--font-pixel), monospace" }}>
            ■ RACE FINANCES
          </span>
          {result.sponsorIncome > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400 text-[13px] font-mono">Sponsor income</span>
              <span className="text-green-400 text-[13px] font-mono font-bold">+{(result.sponsorIncome / 1_000_000).toFixed(1)}M G</span>
            </div>
          )}
          {result.crashLosses > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400 text-[13px] font-mono">Crash losses</span>
              <span className="text-red-400 text-[13px] font-mono font-bold">-{(result.crashLosses / 1_000_000).toFixed(1)}M G</span>
            </div>
          )}
          <div className="border-t border-[#333] my-1" />
          <div className="flex justify-between">
            <span className="text-gray-400 text-[13px] font-mono">Budget after</span>
            <span className="text-white text-[13px] font-mono font-bold">{(result.budgetAfter / 1_000_000).toFixed(1)}M G</span>
          </div>
        </div>
      )}

      {/* Crisis narrative */}
      {result.crisisNarrative && (
        <div
          className="w-full p-4"
          style={{ border: "3px solid #78350f", boxShadow: "4px 4px 0px #1c0a00", backgroundColor: "#0a0800" }}
        >
          <span className="text-amber-400 text-[11px] tracking-widest uppercase block mb-2" style={{ fontFamily: "var(--font-pixel), monospace" }}>
            ■ CRISIS OUTCOME
          </span>
          <p className="text-gray-300 text-[13px] font-mono leading-relaxed">{result.crisisNarrative}</p>
        </div>
      )}

      {/* Stats */}
      <div
        className="w-full p-5 flex flex-col gap-3"
        style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#111111" }}
      >
        <span className="text-amber-400 text-[13px] tracking-widest uppercase mb-1" style={{ fontFamily: "var(--font-pixel), monospace" }}>
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
        style={{ border: "3px solid #374151", boxShadow: "4px 4px 0px #111827", backgroundColor: "#0a0a0a" }}
      >
        <p className="text-gray-300 text-[15px] font-mono leading-relaxed">{result.narrative}</p>
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
        style={{ fontFamily: "var(--font-pixel), monospace", border: "3px solid #f87171", boxShadow: "4px 4px 0px #7f1d1d" }}
        type="button"
      >
        {nextCity ? `CONTINUE TO ${nextCity.toUpperCase()} →` : "SEE SEASON RESULTS →"}
      </button>
    </div>
  );
}

// ─── Main RaceScreen ──────────────────────────────────────────────────────────

export default function RaceScreen({ race, state, onStateChange, onRaceComplete, onContinue }: Props) {
  // Determine initial phase: crisis races start with sponsor, then crisis, then setup
  const initialPhase: Phase = "sponsor";

  const [phase, setPhase] = useState<Phase>(initialPhase);
  // Roll sponsor once when component mounts (React strict mode runs twice in dev, but result is stored)
  const [sponsorResult] = useState(() => rollSponsor(state.publicImage));
  const [crisisRiskModifier, setCrisisRiskModifier] = useState(0);
  const [crashLossMultiplier, setCrashLossMultiplier] = useState(1);
  const [driverBoost, setDriverBoost] = useState(0);
  const [crisisChoiceId, setCrisisChoiceId] = useState<string | undefined>(undefined);
  const [crisisNarrative, setCrisisNarrative] = useState<string | undefined>(undefined);
  const [raceResult, setRaceResult] = useState<ExtendedRaceResult | null>(null);

  const crisisEvent = race.isCrisis ? CRISIS_EVENTS[race.city] : null;

  function handleSponsorContinue() {
    if (race.isCrisis && crisisEvent) {
      setPhase("crisis");
    } else {
      setPhase("setup");
    }
  }

  function handleCrisisChoice(choice: CrisisChoice) {
    // Apply permanent state changes immediately
    const patch: Partial<GameState> = {};
    if (choice.budgetDelta) patch.budget = state.budget + choice.budgetDelta;
    if (choice.carDevelopmentDelta) patch.carDevelopment = Math.min(10, Math.max(0, state.carDevelopment + choice.carDevelopmentDelta));
    if (choice.staffQualityDelta) patch.staffQuality = Math.min(10, Math.max(0, state.staffQuality + choice.staffQualityDelta));
    if (choice.publicImageDelta) patch.publicImage = Math.min(10, Math.max(0, state.publicImage + choice.publicImageDelta));
    if (Object.keys(patch).length > 0) onStateChange(patch);

    // Race-only modifiers stored locally
    setCrisisRiskModifier(choice.riskModifier ?? 0);
    setCrashLossMultiplier(choice.crashLossMultiplier ?? 1);
    setDriverBoost(choice.driverBoost ?? 0);
    setCrisisChoiceId(choice.id);
    setCrisisNarrative(choice.narrative);

    setPhase("setup");
  }

  function handleRunRace() {
    const effectiveRisk = Math.min(10, Math.max(0, state.riskWillingness + crisisRiskModifier));
    const raceData = runRace(state, race.opponentScores, effectiveRisk, driverBoost);
    const crashData = rollCrash(
      effectiveRisk,
      state.lastCarInvestment,
      state.previousCarInvestment,
      crashLossMultiplier,
    );
    const narrative = buildRaceNarrative(race.city, raceData.position);

    // Budget after = current budget + sponsorIncome - crashLosses
    // Note: crisis budget deltas already applied via onStateChange
    const budgetAfter = state.budget + sponsorResult.income - crashData.losses;

    const result: ExtendedRaceResult = {
      ...raceData,
      narrative,
      raceNumber: race.round,
      city: race.city,
      sponsorIncome: sponsorResult.income,
      crashLosses: crashData.losses,
      budgetAfter,
      crisisChoiceId,
      crisisNarrative,
    };

    setRaceResult(result);
    setPhase("result");
    onRaceComplete(result);
  }

  // Determine the next city label for the continue button
  const nextCityLabel: string | null = race.round < 8
    ? ["Paris","Strassburg","Stuttgart","Vienna","Budapest","Bucharest","Sinaia","Istanbul"][race.round] ?? null
    : null;

  return (
    <div className="relative z-20 px-6 max-w-2xl mx-auto flex flex-col items-center gap-8 py-16 w-full">
      {/* Header */}
      <div
        className="px-4 py-2 text-red-400 text-[17px] tracking-widest uppercase"
        style={{ fontFamily: "var(--font-pixel), monospace", border: "3px solid #dc2626", boxShadow: "4px 4px 0px #7f1d1d", backgroundColor: "#1c0a0a" }}
      >
        ▶ RACE {race.round} — {race.city.toUpperCase()}
      </div>

      {/* Orient Express route strip */}
      <OrientExpressRoute currentRound={race.round} />

      {/* City card always visible */}
      <CityCard race={race} />

      {/* Phase: sponsor */}
      {phase === "sponsor" && (
        <SponsorUpdate
          income={sponsorResult.income}
          publicImage={state.publicImage}
          onContinue={handleSponsorContinue}
        />
      )}

      {/* Phase: crisis */}
      {phase === "crisis" && crisisEvent && (
        <CrisisPanel event={crisisEvent} onChoice={handleCrisisChoice} />
      )}

      {/* Phase: setup */}
      {phase === "setup" && (
        <>
          <TeamStatusPanel state={state} />
          <RiskSelector
            value={state.riskWillingness}
            onChange={(v) => onStateChange({ riskWillingness: v })}
          />
          {crisisRiskModifier !== 0 && (
            <div
              className="w-full p-3 text-center"
              style={{ border: "3px solid #78350f", backgroundColor: "#1c1000" }}
            >
              <span className="text-amber-400 text-[12px] font-mono tracking-widest">
                CRISIS MODIFIER: {crisisRiskModifier > 0 ? "+" : ""}{crisisRiskModifier} risk · EFFECTIVE RISK:{" "}
                {Math.min(10, Math.max(0, state.riskWillingness + crisisRiskModifier))}
              </span>
            </div>
          )}
          <button
            onClick={handleRunRace}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-[16px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
            style={{ fontFamily: "var(--font-pixel), monospace", border: "3px solid #f87171", boxShadow: "4px 4px 0px #7f1d1d" }}
            type="button"
          >
            ▶ RUN {race.city.toUpperCase()} RACE
          </button>
        </>
      )}

      {/* Phase: result */}
      {phase === "result" && raceResult && (
        <ExtendedResultPanel
          result={raceResult}
          nextCity={nextCityLabel}
          onContinue={onContinue}
        />
      )}
    </div>
  );
}
