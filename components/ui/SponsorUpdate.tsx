"use client";

// SponsorUpdate — экран спонсорского уведомления (первая фаза каждой гонки).
// Показывает, сработал ли спонсорский контракт и какой доход получен.
// Результат уже вычислен ГПСЧ в RaceScreen — здесь только отображение.

// Пропсы компонента спонсорского уведомления.
interface Props {
  income: number;          // доход от спонсора в G; 0 означает что контракт не сработал
  publicImage: number;     // текущий индекс имиджа для отображения вероятности
  onContinue: () => void;  // переход к следующей фазе (кризис или настройка)
}

// Форматирует сумму в G как строку вида "12.3M G".
function formatG(n: number): string {
  return (n / 1_000_000).toFixed(1) + "M G";
}

// Рендерит карточку с результатом спонсорского контракта и кнопкой продолжения.
export default function SponsorUpdate({ income, publicImage, onContinue }: Props) {
  const hasSponsor = income > 0; // true если спонсор сработал в этой гонке
  const probability = Math.round((publicImage / 10) * 100); // вероятность в % (publicImage / 10)

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
