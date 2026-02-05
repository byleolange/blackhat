import { Button } from "@/components/ui/button";

type RefreshButtonProps = {
  onClick: () => void;
  loading?: boolean;
};

export function RefreshButton({ onClick, loading }: RefreshButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} disabled={loading}>
      {loading ? "Atualizando..." : "Atualizar"}
    </Button>
  );
}
