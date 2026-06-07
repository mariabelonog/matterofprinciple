"use client";

interface HeroScreenProps {
  onStart: () => void;
  onHowToPlay: () => void;
}

export default function HeroScreen({ onStart, onHowToPlay }: HeroScreenProps) {
  return (
    <div className="relative z-20 text-center px-6 max-w-2xl mx-auto flex flex-col items-center gap-6 py-16">

      {/* Season badge */}
      <div
        className="px-4 py-2 text-red-400 text-[17px] tracking-widest uppercase"
        style={{
          fontFamily: "var(--font-pixel), monospace",
          border: "3px solid #dc2626",
          boxShadow: "4px 4px 0px #7f1d1d",
          backgroundColor: "#1c0a0a",
        }}
      >
        ▶ Season Simulation
      </div>

      {/* Title */}
      <h1
        className="text-white leading-tight text-center"
        style={{ fontFamily: "var(--font-pixel), monospace", fontSize: "clamp(1.1rem, 4vw, 2rem)" }}
      >
        <span className="text-white">MATTER</span>
        <br />
        <span className="text-red-500">OF</span>
        <br />
        <span className="text-white">PRINCIPLE</span>
      </h1>

      {/* Pixel racer SVG — copied from original page.tsx */}
      <svg
        width="160"
        height="56"
        viewBox="0 0 160 56"
        style={{ imageRendering: "pixelated" }}
        aria-label="Pixel racing car"
      >
        <rect x="28" y="46" width="104" height="6" fill="#1a1a1a" />
        <rect x="20" y="36" width="120" height="8" fill="#111111" />
        <rect x="16" y="24" width="28" height="16" fill="#1f1f1f" />
        <rect x="116" y="24" width="28" height="16" fill="#1f1f1f" />
        <rect x="32" y="16" width="96" height="24" fill="#dc2626" />
        <rect x="60" y="10" width="40" height="18" fill="#b91c1c" />
        <rect x="66" y="12" width="28" height="10" fill="#0a0a0a" />
        <rect x="68" y="13" width="24" height="7" fill="#1e293b" />
        <rect x="8" y="28" width="24" height="8" fill="#dc2626" />
        <rect x="0" y="30" width="10" height="4" fill="#dc2626" />
        <rect x="138" y="14" width="12" height="4" fill="#dc2626" />
        <rect x="136" y="18" width="4" height="14" fill="#991b1b" />
        <rect x="4" y="34" width="24" height="3" fill="#dc2626" />
        <rect x="16" y="36" width="20" height="14" fill="#333333" rx="2" />
        <rect x="20" y="38" width="12" height="10" fill="#555555" rx="1" />
        <rect x="24" y="41" width="4" height="4" fill="#888888" />
        <rect x="124" y="36" width="20" height="14" fill="#333333" rx="2" />
        <rect x="128" y="38" width="12" height="10" fill="#555555" rx="1" />
        <rect x="132" y="41" width="4" height="4" fill="#888888" />
        <rect x="140" y="24" width="14" height="2" fill="#dc2626" opacity="0.5" />
        <rect x="144" y="28" width="10" height="2" fill="#dc2626" opacity="0.3" />
        <rect x="142" y="32" width="12" height="2" fill="#dc2626" opacity="0.4" />
        <rect x="32" y="22" width="96" height="3" fill="#ffffff" opacity="0.15" />
      </svg>

      {/* Flavor text */}
      <p
        className="text-red-400 text-[14px] leading-loose tracking-wide"
        style={{ fontFamily: "var(--font-pixel), monospace" }}
      >
        YOUR TEAM IS IN CRISIS.
      </p>
      <p className="text-gray-400 text-[17px] leading-relaxed max-w-sm mx-auto tracking-wide font-mono">
        Rararacing is about to go bankrupt. Nobody wants to sail the sinking ship. Your friend from its executives board is begging for a favor — take over team principal's role and lead the boat out of the storm.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <button
          onClick={onStart}
          className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            border: "3px solid #f87171",
            boxShadow: "4px 4px 0px #7f1d1d",
          }}
          type="button"
        >
          ▶ START SEASON
        </button>
        <button
          onClick={onHowToPlay}
          className="px-8 py-4 bg-transparent hover:bg-gray-800 text-gray-300 text-[14px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            border: "3px solid #4b5563",
            boxShadow: "4px 4px 0px #1f2937",
          }}
          type="button"
        >
          HOW TO PLAY
        </button>
      </div>

      <p
        className="text-gray-700 text-[16px] tracking-widest uppercase mt-1"
        style={{ fontFamily: "var(--font-pixel), monospace" }}
      >
        Season 01 · Vortex Motorsport
      </p>
    </div>
  );
}
