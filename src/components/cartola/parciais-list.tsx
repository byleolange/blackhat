import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartolaClube, CartolaPontuado } from "@/lib/cartola/types";

function formatPoints(points: number) {
  return points.toFixed(2).replace(".", ",");
}

type ParciaisListProps = {
  atletas: CartolaPontuado[];
  clubes: Record<string, CartolaClube>;
};

export function ParciaisList({ atletas, clubes }: ParciaisListProps) {
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

          return (
            <div
              key={atleta.atleta_id}
              className="flex flex-col gap-3 rounded-md border px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
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
                  <p className="truncate text-sm font-medium">
                    {atleta.apelido}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pos. {atleta.posicao_id} • Clube {atleta.clube_id}
                  </p>
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
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
