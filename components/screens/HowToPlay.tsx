"use client";

interface HowToPlayProps {
  onBack: () => void;
}

const steps = [
  {
    num: "01",
    title: "NAME YOUR TEAM & PICK A DRIVER",
    body: "You start with 100M G (Geld). First, name your team. Then choose one of three drivers — each has a skill index (0–10) and a cost deducted immediately from your budget.",
  },
  {
    num: "02",
    title: "INVEST BEFORE EACH RACE",
    body: "Allocate Geld into car development, staff quality, and public image. Car dev and staff grow their indices by investment ÷ 20 (capped at 10). Public image grows by investment ÷ 25 — but your risk choice erodes it by 0.05 per risk point each race.",
  },
  {
    num: "03",
    title: "SET YOUR RISK WILLINGNESS",
    body: "Before each race, choose a risk level (0–10). Higher risk boosts your strategy and driver performance, but raises crash probability and slowly damages your public image.",
  },
  {
    num: "04",
    title: "RACE THE CALENDAR",
    body: "8 races across Paris, Strassburg, Stuttgart, Vienna, Budapest, Bucharest, Sinaia, and Istanbul. Your race score is calculated from car performance, driver skill, and strategy — then ranked against 9 CPU opponents to determine your finishing position.",
  },
  {
    num: "05",
    title: "MANAGE CRASHES & SPONSORS",
    body: "Each race: a sponsor contract may pay out (publicImage ÷ 10 chance, worth publicImage × 3M G). A crash may destroy equipment (chance = riskWillingness ÷ 20; loss tied to your last two car investments). Budget < 0 means game over.",
  },
  {
    num: "06",
    title: "SURVIVE CRISIS EVENTS",
    body: "Races at Strassburg, Budapest, and Istanbul include a crisis event with three choices. Each choice shifts your budget, indices, or risk — applied before that race's calculation. There is no safe pick.",
  },
  {
    num: "07",
    title: "SURVIVE THE SEASON",
    body: "Reach Istanbul without going bankrupt. Your final score is based on average race position, remaining budget, and public image. Survival is the win — your ranking is the legacy.",
  },
];

export default function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="relative z-20 px-6 max-w-2xl mx-auto flex flex-col items-center gap-6 py-16 w-full">

      {/* Header */}
      <div
        className="px-4 py-2 text-amber-400 text-[17px] tracking-widest uppercase"
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
                className="text-amber-400 text-[17px] tracking-widest"
                style={{ fontFamily: "var(--font-pixel), monospace" }}
              >
                {step.title}
              </span>
              <p className="text-gray-400 text-[15px] leading-relaxed font-mono">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Indices reference box */}
      <div
        className="w-full p-4 flex flex-col gap-2"
        style={{
          border: "3px solid #dc2626",
          boxShadow: "4px 4px 0px #7f1d1d",
          backgroundColor: "#1c0a0a",
        }}
      >
        <span
          className="text-red-400 text-[16px] tracking-widest mb-1"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          ■ KEY FORMULAS
        </span>
        <p className="text-gray-400 text-[14px] font-mono leading-loose">
          carPerformance = carDev × 0.6 + staffQuality × 0.4<br />
          strategy = staffQuality × 0.7 + riskWillingness × 0.3<br />
          driverInput = driverIndex × 0.6 + riskWillingness × 0.4<br />
          raceScore = carPerf × 0.6 + driverInput × 0.1 + strategy × 0.3
        </p>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="mt-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
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
