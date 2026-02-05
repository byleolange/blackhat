import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatTime(timestamp: number | null) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

type TeamTotalsProps = {
  total: number;
  lastUpdated: number | null;
};

export function TeamTotals({ total, lastUpdated }: TeamTotalsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total parcial</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold">
            {total.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-xs text-muted-foreground">
            Última atualização: {formatTime(lastUpdated)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
