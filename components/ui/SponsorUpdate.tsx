"use client";

interface Props {
  income: number;   // 0 means no contract
  publicImage: number;
  onContinue: () => void;
}

function formatG(n: number): string {
  return (n / 1_000_000).toFixed(1) + "M G";
}

export default function SponsorUpdate({ income, publicImage, onContinue }: Props) {
  const hasSponsor = income > 0;
  const probability = Math.round((publicImage / 10) * 100);

  return (
    <div className="w-full flex flex-col gap-6">
      <div
        className="w-full p-5 flex flex-col gap-3"
        style={{
          border: `3px solid ${hasSponsor ? "#16a34a" : "#374151"}`,
          boxShadow: `4px 4px 0px ${hasSponsor ? "#052e16" : "#111827"}`,
          backgroundColor: hasSponsor ? "#0a1a0a" : "#111111",
        }}
      >
        <span
          className="text-[13px] tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            color: hasSponsor ? "#22c55e" : "#6b7280",
          }}
        >
          ■ {hasSponsor ? "SPONSOR CONTRACT" : "NO SPONSOR CONTRACT"}
        </span>

        {hasSponsor ? (
          <div className="flex flex-col gap-2">
            <span className="text-green-400 text-[28px] font-mono font-bold">
              +{formatG(income)}
            </span>
            <span className="text-gray-500 text-[12px] font-mono">
              Sponsor probability: {probability}% · Public image {publicImage.toFixed(1)}/10
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-[14px] font-mono">
              No sponsor contract before this race.
            </span>
            <span className="text-gray-600 text-[12px] font-mono">
              Sponsor probability: {probability}% · Public image {publicImage.toFixed(1)}/10
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #f87171",
          boxShadow: "4px 4px 0px #7f1d1d",
        }}
        type="button"
      >
        ▶ PROCEED
      </button>
    </div>
  );
}
