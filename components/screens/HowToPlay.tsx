"use client";

interface HowToPlayProps {
  onBack: () => void;
}

const steps = [
  {
    num: "01",
    title: "REVIEW YOUR TEAM",
    body: "Start each season by assessing your budget, car performance, driver morale, staff quality, reputation, and risk level on the Dashboard.",
  },
  {
    num: "02",
    title: "ALLOCATE YOUR BUDGET",
    body: "Decide how to split resources between car development, driver contracts, staff, marketing, and a crisis reserve. Every allocation is a trade-off.",
  },
  {
    num: "03",
    title: "FACE CRISIS EVENTS",
    body: "Mid-season, unexpected crises will strike. Each event presents three choices with different financial and morale consequences. There is no perfect answer.",
  },
  {
    num: "04",
    title: "RACE THE CALENDAR",
    body: "Progress through 8 fictional race rounds. Your choices shape your performance — neglect car development and your points suffer; burn your reserves and you go under.",
  },
  {
    num: "05",
    title: "SURVIVE THE SEASON",
    body: "Reach the end without going bankrupt or being acquired. A season survived is a victory. A second season is an opportunity to build something lasting.",
  },
];

export default function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="relative z-20 px-6 max-w-2xl mx-auto flex flex-col items-center gap-6 py-16 w-full">

      {/* Header */}
      <div
        className="px-4 py-2 text-amber-400 text-[9px] tracking-widest uppercase"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #f59e0b",
          boxShadow: "4px 4px 0px #78350f",
          backgroundColor: "#1c1000",
        }}
      >
        ■ HOW TO PLAY
      </div>

      <h2
        className="text-white text-[14px] tracking-wide text-center"
        style={{ fontFamily: "var(--font-pixel), monospace" }}
      >
        GAME LOOP
      </h2>

      {/* Steps */}
      <div className="flex flex-col gap-4 w-full">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex gap-4 items-start p-4"
            style={{
              border: "3px solid #374151",
              boxShadow: "4px 4px 0px #111827",
              backgroundColor: "#111111",
            }}
          >
            <span
              className="text-red-500 text-[18px] shrink-0 leading-none"
              style={{ fontFamily: "var(--font-pixel), monospace" }}
            >
              {step.num}
            </span>
            <div className="flex flex-col gap-1">
              <span
                className="text-amber-400 text-[9px] tracking-widest"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                {step.title}
              </span>
              <p className="text-gray-400 text-[11px] leading-relaxed font-mono">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="mt-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-[10px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #f87171",
          boxShadow: "4px 4px 0px #7f1d1d",
        }}
        type="button"
      >
        ▶ GOT IT
      </button>
    </div>
  );
}
