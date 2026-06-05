// Pixel-art style landing page. Press Start 2P font is loaded via layout.tsx.
export default function Home() {
  return (
    <main
      className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center relative overflow-hidden"
      style={{ fontFamily: "var(--font-pixel), monospace" }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Pixel grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #dc2626 1px, transparent 1px), linear-gradient(to bottom, #dc2626 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top pixel border strip */}
      <div className="absolute top-0 left-0 w-full flex">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-3"
            style={{ backgroundColor: i % 2 === 0 ? "#dc2626" : "#991b1b" }}
          />
        ))}
      </div>

      {/* Bottom pixel border strip */}
      <div className="absolute bottom-0 left-0 w-full flex">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-3"
            style={{ backgroundColor: i % 2 === 0 ? "#991b1b" : "#dc2626" }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-20 text-center px-6 max-w-2xl mx-auto flex flex-col items-center gap-6">

        {/* Season badge — pixel bordered */}
        <div
          className="px-4 py-2 text-red-400 text-[9px] tracking-widest uppercase"
          style={{
            border: "3px solid #dc2626",
            boxShadow: "4px 4px 0px #7f1d1d",
            backgroundColor: "#1c0a0a",
            imageRendering: "pixelated",
          }}
        >
          ▶ Season Simulation
        </div>

        {/* Title */}
        <h1 className="text-white leading-tight text-center" style={{ fontSize: "clamp(1.1rem, 4vw, 2rem)" }}>
          <span className="text-white">MATTER</span>
          <br />
          <span className="text-red-500">OF</span>
          <br />
          <span className="text-white">PRINCIPLE</span>
        </h1>

        {/* Pixel racer SVG */}
        <svg
          width="160"
          height="56"
          viewBox="0 0 160 56"
          style={{ imageRendering: "pixelated" }}
          aria-label="Pixel racing car"
        >
          {/* Shadow */}
          <rect x="28" y="46" width="104" height="6" fill="#1a1a1a" />

          {/* Undertray / floor */}
          <rect x="20" y="36" width="120" height="8" fill="#111111" />

          {/* Side pods */}
          <rect x="16" y="24" width="28" height="16" fill="#1f1f1f" />
          <rect x="116" y="24" width="28" height="16" fill="#1f1f1f" />

          {/* Main body */}
          <rect x="32" y="16" width="96" height="24" fill="#dc2626" />

          {/* Cockpit surround */}
          <rect x="60" y="10" width="40" height="18" fill="#b91c1c" />

          {/* Cockpit dark visor */}
          <rect x="66" y="12" width="28" height="10" fill="#0a0a0a" />
          <rect x="68" y="13" width="24" height="7" fill="#1e293b" />

          {/* Nose cone */}
          <rect x="8" y="28" width="24" height="8" fill="#dc2626" />
          <rect x="0" y="30" width="10" height="4" fill="#dc2626" />

          {/* Rear wing */}
          <rect x="138" y="14" width="12" height="4" fill="#dc2626" />
          <rect x="136" y="18" width="4" height="14" fill="#991b1b" />

          {/* Front wing */}
          <rect x="4" y="34" width="24" height="3" fill="#dc2626" />

          {/* Wheels — front */}
          <rect x="16" y="36" width="20" height="14" fill="#333333" rx="2" />
          <rect x="20" y="38" width="12" height="10" fill="#555555" rx="1" />
          <rect x="24" y="41" width="4" height="4" fill="#888888" />

          {/* Wheels — rear */}
          <rect x="124" y="36" width="20" height="14" fill="#333333" rx="2" />
          <rect x="128" y="38" width="12" height="10" fill="#555555" rx="1" />
          <rect x="132" y="41" width="4" height="4" fill="#888888" />

          {/* Speed lines */}
          <rect x="140" y="24" width="14" height="2" fill="#dc2626" opacity="0.5" />
          <rect x="144" y="28" width="10" height="2" fill="#dc2626" opacity="0.3" />
          <rect x="142" y="32" width="12" height="2" fill="#dc2626" opacity="0.4" />

          {/* White stripe on body */}
          <rect x="32" y="22" width="96" height="3" fill="#ffffff" opacity="0.15" />
        </svg>

        {/* Subtitle */}
        <p className="text-red-400 text-[10px] leading-loose tracking-wide">
          YOUR TEAM IS IN CRISIS.
        </p>
        <p className="text-gray-400 text-[9px] leading-loose max-w-sm mx-auto tracking-wide">
          ONE SEASON. CRITICAL DECISIONS.
          <br />
          PROVE YOUR PRINCIPLES ARE WORTH FIGHTING FOR.
        </p>

        {/* CTA Button */}
        <button
          className="mt-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-[10px] tracking-widest uppercase transition-colors duration-100 cursor-pointer active:translate-y-[2px]"
          style={{
            border: "3px solid #f87171",
            boxShadow: "4px 4px 0px #7f1d1d",
            outline: "none",
          }}
          type="button"
        >
          ▶ START SEASON
        </button>

        <p className="text-gray-700 text-[8px] tracking-widest uppercase mt-1">
          Season 01 · Coming Soon
        </p>
      </div>

      {/* Footer label */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <span className="text-gray-700 text-[7px] tracking-[0.5em] uppercase">
          Economic Racing Simulation
        </span>
      </div>
    </main>
  );
}
