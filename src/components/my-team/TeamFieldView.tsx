import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerChip } from "@/components/my-team/PlayerChip";
import { groupPlayersByPosition } from "@/lib/positions";
import { getClubColorsById } from "@/lib/cartola/club-colors";
import type { MergedAtleta } from "@/lib/cartola/types";

type TeamFieldViewProps = {
  atletas: MergedAtleta[];
};

export function TeamFieldView({ atletas }: TeamFieldViewProps) {
  const grouped = React.useMemo(() => groupPlayersByPosition(atletas), [atletas]);
  const lines = [
    { key: "fwd", players: grouped.fwd },
    { key: "mid", players: grouped.mid },
    { key: "def", players: [...grouped.lat, ...grouped.def] },
    { key: "gk", players: grouped.gk }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campo</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative mx-auto w-full max-w-[460px] overflow-hidden rounded-2xl border border-emerald-300/60 bg-emerald-100 px-1.5 py-2 shadow-sm"
          style={{ aspectRatio: "3 / 4" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0)_35%,rgba(255,255,255,0.25))]" />
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(90deg,rgba(0,0,0,0.04)_0,rgba(0,0,0,0.04)_22px,transparent_22px,transparent_44px)]" />
          <div className="pointer-events-none absolute inset-3 rounded-xl border border-black/70" />
          <div className="pointer-events-none absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-black/70" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/70" />
          <div className="pointer-events-none absolute left-1/2 top-3 h-10 w-20 -translate-x-1/2 border border-black/70" />
          <div className="pointer-events-none absolute left-1/2 bottom-3 h-10 w-20 -translate-x-1/2 border border-black/70" />
          <div className="pointer-events-none absolute left-1/2 top-3 h-5 w-10 -translate-x-1/2 border border-black/70" />
          <div className="pointer-events-none absolute left-1/2 bottom-3 h-5 w-10 -translate-x-1/2 border border-black/70" />

          <div className="absolute inset-0 grid grid-rows-[1fr_1fr_1fr_0.9fr] px-2 py-2">
            {lines.map((line) => {
              if (!line.players.length) return null;

              return (
                <div
                  key={line.key}
                  className="flex flex-wrap items-center justify-center gap-1"
                >
                  {line.players.map((atleta) => {
                    const clubeId = atleta.clube_id ?? null;
                    const colors = getClubColorsById(clubeId);
                    return (
                      <PlayerChip
                        key={atleta.atleta_id}
                        atleta={atleta}
                        colors={colors}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        {grouped.coach.length ? (
          <div className="mt-2 flex items-center justify-center gap-1 sm:gap-2">
            {grouped.coach.map((atleta) => {
              const clubeId = atleta.clube_id ?? null;
              const colors = getClubColorsById(clubeId);
              return (
                <PlayerChip
                  key={atleta.atleta_id}
                  atleta={atleta}
                  colors={colors}
                />
              );
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
