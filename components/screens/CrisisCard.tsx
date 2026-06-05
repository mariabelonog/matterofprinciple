"use client";

import { crisisEvent } from "@/data/mockData";

interface CrisisCardProps {
  onChoice: (choiceId: string) => void;
}

export default function CrisisCard({ onChoice }: CrisisCardProps) {
  return (
    <div className="relative z-30 w-full max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-6">

      {/* Crisis badge */}
      <div
        className="px-4 py-2 text-red-400 text-[14px] tracking-widest uppercase"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #dc2626",
          boxShadow: "4px 4px 0px #7f1d1d",
          backgroundColor: "#1c0a0a",
        }}
      >
        ⚠ CRISIS
      </div>

      {/* Event title */}
      <h2
        className="text-red-500 text-center leading-snug"
        style={{ fontFamily: "var(--font-pixel), monospace", fontSize: "clamp(0.75rem, 3vw, 1.1rem)" }}
      >
        {crisisEvent.title}
      </h2>

      {/* Event description */}
      <p className="text-gray-300 text-[16px] leading-relaxed font-mono text-center max-w-lg">
        {crisisEvent.description}
      </p>

      {/* Choice cards */}
      <div className="flex flex-col gap-4 w-full mt-2">
        {crisisEvent.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onChoice(choice.id)}
            className="w-full text-left p-4 flex flex-col gap-2 cursor-pointer transition-all duration-100 active:translate-y-[2px] group"
            style={{
              border: "3px solid #374151",
              boxShadow: "4px 4px 0px #111827",
              backgroundColor: "#111111",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#f59e0b";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px #78350f";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1c1000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#374151";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px #111827";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#111111";
            }}
            type="button"
          >
            <span
              className="text-amber-400 text-[17px] tracking-widest"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              {choice.label.toUpperCase()}
            </span>
            <p className="text-gray-400 text-[15px] font-mono leading-relaxed">{choice.description}</p>
            <span
              className="text-gray-500 text-[16px] tracking-wide font-mono"
            >
              {choice.consequence}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
