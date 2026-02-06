import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CartolaClube, CartolaMercadoAtleta } from "@/lib/cartola/types";

type PlayerHeaderProps = {
  atleta: CartolaMercadoAtleta;
  clube: CartolaClube | null;
  jogos: number | null;
  jogosLoading: boolean;
};

export function PlayerHeader({
  atleta,
  clube,
  jogos,
  jogosLoading
}: PlayerHeaderProps) {
  const escudo =
    clube?.escudos?.["60x60"] ||
    clube?.escudos?.["45x45"] ||
    clube?.escudos?.["30x30"] ||
    null;

  const nome = atleta.apelido || atleta.nome || "Jogador";
  const jogosLabel = jogosLoading ? "—" : jogos ?? "—";

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl sm:text-2xl">{nome}</CardTitle>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {escudo ? (
              <img
                src={escudo}
                alt={`Escudo ${clube?.abreviacao ?? "clube"}`}
                className="h-8 w-8 shrink-0 object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground">
                {clube?.abreviacao ?? "?"}
              </div>
            )}
            <span>{clube?.nome ?? "Clube não informado"}</span>
          </div>
          <Badge variant="secondary" className="px-2 py-0 text-xs">
            Participações na temporada: {jogosLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        Contagem até a rodada atual.
      </CardContent>
    </Card>
  );
}
