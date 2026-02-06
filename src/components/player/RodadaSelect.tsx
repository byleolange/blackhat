type RodadaOption = {
  value: number;
  label: string;
};

type RodadaSelectProps = {
  value: number;
  options: RodadaOption[];
  onChange: (value: number) => void;
};

export function RodadaSelect({ value, options, onChange }: RodadaSelectProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-muted-foreground">Rodada</span>
      <select
        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
