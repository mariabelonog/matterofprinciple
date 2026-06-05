export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/30 via-gray-950 to-gray-950 pointer-events-none" />

      {/* Top and bottom accent lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Season badge */}
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-red-600/60 bg-red-950/40 text-red-400 text-sm font-semibold tracking-widest uppercase">
          Season Simulation
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 leading-none">
          <span className="text-white">Matter</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
            of
          </span>{" "}
          <span className="text-white">Principle</span>
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-600" />
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-600" />
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 mb-4 leading-relaxed">
          Your racing team is on the brink of collapse.
        </p>
        <p className="text-base md:text-lg text-gray-500 mb-12 leading-relaxed max-w-xl mx-auto">
          You have one season to turn it around. Manage budgets, make critical
          decisions, and prove that your principles are worth fighting for.
        </p>

        {/* CTA Button — not wired up yet */}
        <button
          className="group relative inline-flex items-center gap-3 px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg tracking-widest uppercase transition-all duration-200 border-2 border-red-600 hover:border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] cursor-pointer"
          type="button"
        >
          <span>Start Season</span>
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        <p className="mt-4 text-gray-600 text-sm">Season 1 · Coming Soon</p>
      </div>

      {/* Bottom decorative label */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <span className="text-gray-700 text-xs tracking-[0.4em] uppercase font-mono">
          Economic Racing Simulation
        </span>
      </div>
    </main>
  );
}
