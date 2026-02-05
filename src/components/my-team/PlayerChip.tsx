import { formatPoints } from "@/lib/format";
import type { MergedAtleta } from "@/lib/cartola/types";
import type { ClubColors } from "@/lib/cartola/club-colors";

type PlayerChipProps = {
  atleta: MergedAtleta;
  colors?: ClubColors | null;
};
export function PlayerChip({ atleta, colors }: PlayerChipProps) {
  const gradientId = `kit-${atleta.atleta_id}`;
  const pointsValue = atleta.pontuacao_final ?? atleta.pontuacao ?? null;
  const pointsText = formatPoints(pointsValue);
  const isNegative = typeof pointsValue === "number" && pointsValue < 0;
  const primaryColor = colors?.primary ?? "#1c6b3c";
  const secondaryColor = colors?.secondary ?? "#0f4f2b";

  return (
    <div
      className="relative flex min-w-[96px] max-w-[120px] flex-col items-center text-center"
      data-club-id={atleta.clube_id ?? undefined}
      data-club-colors={`${primaryColor},${secondaryColor}`}
    >
      <div className="relative -mb-1 h-12 w-14">
        <svg
          viewBox="0 0 128 128"
          className="h-12 w-14 drop-shadow"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
          </defs>
          <path
            d="M36 18h56l10 16-14 10v48a10 10 0 0 1-10 10H50a10 10 0 0 1-10-10V44L26 34l10-16z"
            fill={`url(#${gradientId})`}
          />
          <path d="M42 22h44v6H42z" fill={secondaryColor} opacity="0.9" />
          <path
            d="M28 33l12 9v-6l-8-8zM100 33l-12 9v-6l8-8z"
            fill={secondaryColor}
            opacity="0.9"
          />
        </svg>
      </div>
      <div className="w-full overflow-hidden rounded-lg text-white shadow-md">
        <div className="bg-slate-800 px-2.5 pb-[0.3rem] pt-[0.3rem]">
          <p className="truncate text-[10px] font-medium">{atleta.apelido}</p>
        </div>
        <div className="bg-emerald-900 px-2.5 pb-[0.3rem] pt-[0.3rem]">
          <p
            className={`text-[11px] font-semibold ${
              isNegative ? "text-red-400" : "text-emerald-200"
            }`}
          >
            {pointsText}
          </p>
        </div>
      </div>
    </div>
  );
}
