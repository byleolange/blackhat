import { Badge } from "@/components/ui/badge";
import { getScoutLabel } from "@/lib/cartola/scouts";

type ScoutItem = {
  code: string;
  value: number;
};

type ScoutsGridProps = {
  title: string;
  scouts: ScoutItem[];
};

function formatScoutValue(value: number) {
  const stringValue = Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2);
  return stringValue.replace(".", ",");
}

export function ScoutsGrid({ title, scouts }: ScoutsGridProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {scouts.map((scout) => (
          <div
            key={scout.code}
            className="flex items-center justify-between rounded-md border px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-2 py-0 text-[10px] font-mono">
                {scout.code}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {getScoutLabel(scout.code)}
              </span>
            </div>
            <span className="font-semibold tabular-nums">{formatScoutValue(scout.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
