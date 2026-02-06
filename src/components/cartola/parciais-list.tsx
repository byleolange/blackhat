"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartolaClube, CartolaPontuado } from "@/lib/cartola/types";

function formatPoints(points: number) {
  return points.toFixed(2).replace(".", ",");
}

type ParciaisListProps = {
  atletas: CartolaPontuado[];
  clubes: Record<string, CartolaClube>;
};

function buildPlayerHref(atleta: CartolaPontuado) {
  const params = new URLSearchParams();
  if (atleta.apelido) params.set("apelido", atleta.apelido);
  if (atleta.clube_id) params.set("clube_id", String(atleta.clube_id));
  if (atleta.posicao_id) params.set("posicao_id", String(atleta.posicao_id));
  const query = params.toString();
  return query
    ? `/jogador/${atleta.atleta_id}?${query}`
    : `/jogador/${atleta.atleta_id}`;
}

export function ParciaisList({ atletas, clubes }: ParciaisListProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parciais gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {atletas.map((atleta) => {
          const clube = clubes[String(atleta.clube_id)];
          const escudo =
            clube?.escudos?.["30x30"] ||
            clube?.escudos?.["45x45"] ||
            clube?.escudos?.["60x60"] ||
            null;

          const href = buildPlayerHref(atleta);

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
                <div className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {atleta.apelido}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Pos. {atleta.posicao_id} • Clube {atleta.clube_id}
                  </span>
                </div>
              </div>
              <span
                className={[
                  "self-end text-sm font-semibold sm:self-auto",
                  atleta.pontuacao > 0
                    ? "text-emerald-600"
                    : atleta.pontuacao < 0
                      ? "text-rose-600"
                      : "text-foreground"
                ].join(" ")}
              >
                {formatPoints(atleta.pontuacao)}
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
