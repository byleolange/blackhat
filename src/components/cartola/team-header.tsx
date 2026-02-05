import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const statusMap: Record<number, string> = {
  1: "Mercado aberto",
  2: "Mercado fechado",
  3: "Mercado em atualização",
  4: "Mercado fechado",
  5: "Mercado em manutenção",
  6: "Mercado fechado",
  7: "Mercado fechado"
};

type TeamHeaderProps = {
  time: string;
  cartoleiro: string;
  rodada?: number | null;
  statusMercado?: number | null;
};

export function TeamHeader({
  time,
  cartoleiro,
  rodada,
  statusMercado
}: TeamHeaderProps) {
  const statusLabel =
    statusMercado !== null && statusMercado !== undefined
      ? statusMap[statusMercado] ?? `Status ${statusMercado}`
      : null;
  const isOpen = statusMercado === 1;
  const isClosed =
    statusMercado === 2 ||
    statusMercado === 4 ||
    statusMercado === 6 ||
    statusMercado === 7;
  const statusClass = isOpen
    ? "text-emerald-600"
    : isClosed
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{time}</CardTitle>
        <p className="text-sm text-muted-foreground">{cartoleiro}</p>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-wrap gap-2 pt-4 text-sm text-muted-foreground">
        {rodada ? <span>Rodada {rodada}</span> : null}
        {rodada && statusLabel ? (
          <span className="text-muted-foreground">•</span>
        ) : null}
        {statusLabel ? <span className={statusClass}>{statusLabel}</span> : null}
      </CardContent>
    </Card>
  );
}
