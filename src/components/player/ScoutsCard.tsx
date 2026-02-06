import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoutsGrid } from "@/components/player/ScoutsGrid";
import { Badge } from "@/components/ui/badge";
import { POSITIVE_SCOUTS, NEGATIVE_SCOUTS } from "@/lib/cartola/scouts";


type ScoutsCardProps = {
  loading: boolean;
  scouts: Record<string, number> | null;
  jogadorJogou: boolean;
  isPartial: boolean;
};

export function ScoutsCard({
  loading,
  scouts,
  jogadorJogou,
  isPartial
}: ScoutsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Scouts da rodada</CardTitle>
          {isPartial ? (
            <Badge variant="secondary" className="px-2 py-0 text-[10px]">
              Dados parciais
            </Badge>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!jogadorJogou || !scouts) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Scouts da rodada</CardTitle>
          {isPartial ? (
            <Badge variant="secondary" className="px-2 py-0 text-[10px]">
              Dados parciais
            </Badge>
          ) : null}
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Jogador não atuou na rodada.
        </CardContent>
      </Card>
    );
  }

  const positiveItems = POSITIVE_SCOUTS.map((code) => ({
    code,
    value: scouts[code] ?? 0
  }));

  const negativeItems = NEGATIVE_SCOUTS.map((code) => ({
    code,
    value: scouts[code] ?? 0
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Scouts da rodada</CardTitle>
        {isPartial ? (
          <Badge variant="secondary" className="px-2 py-0 text-[10px]">
            Dados parciais
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <ScoutsGrid title="Scouts positivos" scouts={positiveItems} />
        <Separator />
        <ScoutsGrid title="Scouts negativos" scouts={negativeItems} />
      </CardContent>
    </Card>
  );
}
