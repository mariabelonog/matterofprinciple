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
    body: "Some races will hit you with a crisis event and three hard choices. Each choice shifts your budget, indices, or risk — applied before that race's calculation. There is no safe pick.",
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

      {/* Key formulas box */}
      <div
        className="w-full flex flex-col gap-0"
        style={{
          border: "3px solid #dc2626",
          boxShadow: "4px 4px 0px #7f1d1d",
          backgroundColor: "#0d0404",
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{ borderBottom: "2px solid #7f1d1d", backgroundColor: "#1c0a0a" }}
        >
          <span
            className="text-red-400 text-[13px] tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            ■ KEY FORMULAS
          </span>
        </div>

        {/* Formula rows */}
        {[
          {
            label: "CAR PERFORMANCE",
            lhs: "Car Performance",
            terms: [
              { value: "Car Development", weight: "60%", color: "#f59e0b" },
              { value: "Staff Quality", weight: "40%", color: "#22c55e" },
            ],
          },
          {
            label: "STRATEGY",
            lhs: "Strategy",
            terms: [
              { value: "Staff Quality", weight: "70%", color: "#22c55e" },
              { value: "Risk", weight: "30%", color: "#f87171" },
            ],
          },
          {
            label: "DRIVER INPUT",
            lhs: "Driver Input",
            terms: [
              { value: "Driver Skill", weight: "60%", color: "#818cf8" },
              { value: "Risk", weight: "40%", color: "#f87171" },
            ],
          },
          {
            label: "RACE SCORE",
            lhs: "Race Score",
            terms: [
              { value: "Car Performance", weight: "60%", color: "#f59e0b" },
              { value: "Driver Input", weight: "10%", color: "#818cf8" },
              { value: "Strategy", weight: "30%", color: "#22c55e" },
            ],
            note: undefined,
          },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 px-4 py-3"
            style={{ borderBottom: i < arr.length - 1 ? "1px solid #2d0a0a" : undefined }}
          >
            <span className="text-gray-600 text-[10px] font-mono tracking-[0.2em] uppercase">{row.label}</span>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
              <span className="text-white text-[13px] font-mono">{row.lhs}</span>
              <span className="text-gray-600 text-[13px] font-mono">=</span>
              {row.terms.map((t, ti) => (
                <span key={t.value} className="flex items-center gap-1">
                  {ti > 0 && <span className="text-gray-600 text-[13px] font-mono">+</span>}
                  <span className="text-[13px] font-mono" style={{ color: t.color }}>{t.value}</span>
                  <span
                    className="text-[10px] font-mono px-1"
                    style={{ color: "#555", backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
                  >
                    {t.weight}
                  </span>
                </span>
              ))}
              {row.note && (
                <span className="text-[10px] font-mono text-amber-800 ml-1">· {row.note}</span>
              )}
            </div>
          </div>
        ))}
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
