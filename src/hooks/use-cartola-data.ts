import * as React from "react";

import type {
  CartolaPontuadosResponse,
  CartolaStatusResponse,
  CartolaTeamResponse
} from "@/lib/cartola/types";
import { useCartolaStore } from "@/lib/store/useCartolaStore";

export function useCartolaData(slug: string | null) {
  const setLastUpdated = useCartolaStore((state) => state.setLastUpdated);
  const [team, setTeam] = React.useState<CartolaTeamResponse | null>(null);
  const [pontuados, setPontuados] = React.useState<CartolaPontuadosResponse | null>(null);
  const [status, setStatus] = React.useState<CartolaStatusResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAll = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setTeam(null);
    setPontuados(null);
    setStatus(null);

    try {
      const teamPromise = slug
        ? fetch(`/api/cartola/time?slug=${encodeURIComponent(slug)}`, {
          cache: "no-store"
        })
        : Promise.resolve(null);
      const [teamRes, pontuadosRes, statusRes] = await Promise.all([
        teamPromise,
        fetch("/api/cartola/pontuados", { cache: "no-store" }),
        fetch("/api/cartola/status", { cache: "no-store" })
      ]);

      if (slug && teamRes && !teamRes.ok) {
        throw new Error("Time não encontrado.");
      }

      if (!pontuadosRes.ok) {
        throw new Error("Erro ao buscar parciais.");
      }

      const teamData = slug && teamRes ? ((await teamRes.json()) as CartolaTeamResponse) : null;
      const pontuadosData = (await pontuadosRes.json()) as CartolaPontuadosResponse;
      const statusData = statusRes.ok
        ? ((await statusRes.json()) as CartolaStatusResponse)
        : null;

      setTeam(teamData);
      setPontuados(pontuadosData);
      setStatus(statusData);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }, [slug, setLastUpdated]);

  React.useEffect(() => {
    fetchAll().catch((err) => {
      console.error("Erro ao buscar dados do Cartola:", err);
    });
  }, [fetchAll]);

  return {
    team,
    pontuados,
    status,
    loading,
    error,
    refresh: fetchAll
  };
}
