"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPoints } from "@/lib/format";
import type { CartolaClube, MergedAtleta } from "@/lib/cartola/types";
import { getPositionName } from "@/lib/positions";

type TeamListViewProps = {
  atletas: MergedAtleta[];
  clubes: Record<string, CartolaClube>;
  participacoes?: Record<number, number> | null;
  participacoesLoading?: boolean;
};

function buildPlayerHref(atleta: MergedAtleta) {
  const params = new URLSearchParams();
  if (atleta.apelido) params.set("apelido", atleta.apelido);
  if (atleta.clube_id) params.set("clube_id", String(atleta.clube_id));
  if (atleta.posicao_id) params.set("posicao_id", String(atleta.posicao_id));
  const query = params.toString();
  return query
    ? `/jogador/${atleta.atleta_id}?${query}`
    : `/jogador/${atleta.atleta_id}`;
}

export function TeamListView({
  atletas,
  clubes,
  participacoes,
  participacoesLoading
}: TeamListViewProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escalação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {atletas.map((atleta) => {
          const clube = atleta.clube_id ? clubes[String(atleta.clube_id)] : null;
          const escudo =
            clube?.escudos?.["30x30"] ||
            clube?.escudos?.["45x45"] ||
            clube?.escudos?.["60x60"] ||
            null;

          const href = buildPlayerHref(atleta);

          const posicaoNome = getPositionName(atleta.posicao_id);
          const clubeNome = clube?.nome || (atleta.clube_id ? `Clube ${atleta.clube_id}` : "");

          // Build the info line with position, club, and optional badges
          const infoParts: string[] = [];
          if (posicaoNome) infoParts.push(`Pos: ${posicaoNome}`);
          if (clubeNome) infoParts.push(`Clube: ${clubeNome}`);

          return (
            <Link
              key={atleta.atleta_id}
              href={href}
              prefetch={true}
              onClick={(e) => {
                e.preventDefault();
                router.push(href);
              }}
              aria-label={`Abrir detalhes de ${atleta.apelido}`}
              className="flex w-full flex-col gap-3 rounded-md border px-3 py-2 text-left transition hover:border-foreground/40 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                {escudo ? (
                  <img
                    src={escudo}
                    alt={`Escudo ${clube?.abreviacao ?? "clube"}`}
                    className="h-7 w-7 shrink-0 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground">
                    {clube?.abreviacao ?? "?"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="block truncate text-sm font-medium">
                      {atleta.apelido}
                    </span>
                    {atleta.isCapitao && (
                      <Badge
                        variant="secondary"
                        className="shrink-0 whitespace-nowrap px-2 py-0 text-[10px]"
                      >
                        C
                      </Badge>
                    )}
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="block truncate text-xs text-muted-foreground">
                      {infoParts.join(" • ")}
                      {participacoes !== undefined && participacoes !== null && (
                        <>
                          {" • "}Part: {participacoesLoading ? "—" : participacoes[atleta.atleta_id] ?? "—"}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={[
                  "self-end text-sm font-semibold sm:self-auto",
                  (atleta.pontuacao_final ?? atleta.pontuacao ?? 0) > 0
                    ? "text-emerald-600"
                    : (atleta.pontuacao_final ?? atleta.pontuacao ?? 0) < 0
                      ? "text-rose-600"
                      : "text-foreground"
                ].join(" ")}
              >
                {formatPoints(atleta.pontuacao_final ?? atleta.pontuacao)}
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
