"use client";

import { useEffect, useRef, useState } from "react";
import type { CrisisEvent, CrisisChoice } from "@/types/game";

const CRISIS_SECONDS = 15;

interface Props {
  event: CrisisEvent;
  onChoice: (choice: CrisisChoice) => void;
}

function formatDelta(label: string, value: number | undefined): string | null {
  if (value === undefined || value === 0) return null;
  const sign = value > 0 ? "+" : "";
  return `${label}: ${sign}${value}`;
}

function formatBudgetDelta(value: number | undefined): string | null {
  if (value === undefined || value === 0) return null;
  const sign = value > 0 ? "+" : "";
  return `Budget: ${sign}${(value / 1_000_000).toFixed(0)}M G`;
}

function ChoiceEffects({ choice }: { choice: CrisisChoice }) {
  const effects = [
    formatBudgetDelta(choice.budgetDelta),
    formatDelta("Car Dev", choice.carDevelopmentDelta),
    formatDelta("Staff", choice.staffQualityDelta),
    formatDelta("Image", choice.publicImageDelta),
    formatDelta("Risk mod", choice.riskModifier),
  ].filter(Boolean);

  if (effects.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {effects.map((e) => (
        <span
          key={e}
          className="text-[11px] font-mono px-2 py-0.5"
          style={{
            border: "1px solid #374151",
            backgroundColor: "#0a0a0a",
            color:
              (e ?? "").startsWith("Budget: -") ||
              (e ?? "").startsWith("Staff: -") ||
              (e ?? "").startsWith("Image: -")
                ? "#f87171"
                : "#86efac",
          }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}

export default function CrisisPanel({ event, onChoice }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(CRISIS_SECONDS);
  const [expired, setExpired] = useState(false);
  const chosenRef = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!chosenRef.current) {
        chosenRef.current = true;
        setExpired(true);
        // Auto-select the middle (safest-looking) choice after a brief pause
        const id = setTimeout(() => onChoice(event.choices[1] ?? event.choices[0]), 600);
        return () => clearTimeout(id);
      }
      return;
    }

    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, event.choices, onChoice]);

  function handleChoice(choice: CrisisChoice) {
    if (chosenRef.current) return;
    chosenRef.current = true;
    onChoice(choice);
  }

  const pct = (secondsLeft / CRISIS_SECONDS) * 100;
  const barColor = secondsLeft > 8 ? "#22c55e" : secondsLeft > 4 ? "#f59e0b" : "#dc2626";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Crisis badge */}
      <div
        className="w-full p-4 flex flex-col gap-3"
        style={{
          border: "3px solid #dc2626",
          boxShadow: "4px 4px 0px #7f1d1d",
          backgroundColor: "#1c0a0a",
        }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-red-400 text-[11px] tracking-widest uppercase px-2 py-1 shrink-0"
            style={{
              fontFamily: "var(--font-pixel), monospace",
              border: "2px solid #dc2626",
              backgroundColor: "#0a0a0a",
            }}
          >
            CRISIS EVENT
          </span>
          <span
            className="text-amber-400 text-[15px] tracking-widest uppercase flex-1"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            {event.title}
          </span>

          {/* Countdown */}
          <span
            className="text-[20px] font-mono font-bold shrink-0 tabular-nums"
            style={{ color: barColor, minWidth: "2.2ch", textAlign: "right" }}
          >
            {expired ? "—" : secondsLeft}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[4px] bg-[#1a0808]" style={{ border: "1px solid #3a0a0a" }}>
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              backgroundColor: barColor,
              transition: "width 1s linear, background-color 0.3s",
            }}
          />
        </div>

        <p className="text-gray-300 text-[14px] font-mono leading-relaxed">{event.description}</p>

        {expired && (
          <p className="text-red-400 text-[12px] font-mono tracking-widest uppercase">
            ▶ TIME EXPIRED — DEFAULT CHOICE APPLIED
          </p>
        )}
      </div>

      {/* Choices */}
      <div className="w-full flex flex-col gap-4">
        {event.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice)}
            disabled={expired}
            className="w-full p-4 text-left flex flex-col gap-2 cursor-pointer transition-colors duration-100 hover:bg-[#1a1a1a] active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              border: "3px solid #374151",
              boxShadow: "4px 4px 0px #111827",
              backgroundColor: "#111111",
            }}
            type="button"
          >
            <span
              className="text-white text-[13px] tracking-widest uppercase"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              ▶ {choice.label}
            </span>
            <span className="text-gray-400 text-[13px] font-mono">{choice.description}</span>
            <ChoiceEffects choice={choice} />
          </button>
        ))}
      </div>
    </div>
  );
}
