import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPoints } from "@/lib/format";
import type { CartolaClube, MergedAtleta } from "@/lib/cartola/types";

type TeamListViewProps = {
  atletas: MergedAtleta[];
  clubes: Record<string, CartolaClube>;
};

export function TeamListView({ atletas, clubes }: TeamListViewProps) {
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

          return (
            <div
              key={atleta.atleta_id}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
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
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {atleta.apelido}
                    </p>
                    {atleta.isCapitao ? (
                      <Badge
                        variant="secondary"
                        className="shrink-0 whitespace-nowrap px-2 py-0 text-[10px] sm:text-xs"
                      >
                        <span className="hidden max-[400px]:inline">C</span>
                        <span className="max-[400px]:hidden">
                          Capitão 1,5x
                        </span>
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold">
                {formatPoints(atleta.pontuacao_final ?? atleta.pontuacao)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
