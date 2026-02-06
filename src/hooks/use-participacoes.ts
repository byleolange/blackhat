"use client";

import * as React from "react";

import { LRUCache } from "@/lib/cache";
import type { ParticipacoesResponse } from "@/lib/cartola/participacoes";
import { normalizeParticipacoes } from "@/lib/cartola/participacoes";

type ParticipacoesState = {
  data: Record<number, number> | null;
  loading: boolean;
  error: string | null;
  partial: boolean;
};

// LRU Cache with size limit to prevent memory leaks
const participacoesCache = new LRUCache<
  string,
  { data: Record<number, number>; partial: boolean }
>(100);
const participacoesPromiseCache = new Map<
  string,
  Promise<ParticipacoesResponse>
>();

function buildKey(rodadaAtual: number, ids: number[]) {
  const sorted = Array.from(new Set(ids)).sort((a, b) => a - b);
  return { key: `${rodadaAtual}:${sorted.join(",")}`, sorted };
}

export function useParticipacoes(
  atletaIds: number[],
  rodadaAtual?: number
): ParticipacoesState {
  const [state, setState] = React.useState<ParticipacoesState>({
    data: null,
    loading: Boolean(atletaIds.length && rodadaAtual),
    error: null,
    partial: false
  });

  const memo = React.useMemo(() => {
    if (!rodadaAtual || !atletaIds.length) return null;
    return buildKey(rodadaAtual, atletaIds);
  }, [rodadaAtual, atletaIds]);

  React.useEffect(() => {
    if (!memo) {
      setState({ data: null, loading: false, error: null, partial: false });
      return;
    }

    const { key, sorted } = memo;
    const cached = participacoesCache.get(key);
    if (cached) {
      setState({
        data: cached.data,
        loading: false,
        error: null,
        partial: cached.partial
      });
      return;
    }

    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: null }));

    const inflight = participacoesPromiseCache.get(key);
    const promise =
      inflight ??
      fetch(
        `/api/cartola/participacoes?rodada=${rodadaAtual}&atleta_ids=${sorted.join(",")}`,
        { cache: "no-store" }
      ).then(async (res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar participações.");
        }
        return (await res.json()) as ParticipacoesResponse;
      });

    if (!inflight) {
      participacoesPromiseCache.set(key, promise);
    }

    promise
      .then((response) => {
        const normalized = normalizeParticipacoes(response);
        participacoesCache.set(key, {
          data: normalized,
          partial: Boolean(response.partial)
        });
        if (cancelled) return;
        setState({
          data: normalized,
          loading: false,
          error: null,
          partial: Boolean(response.partial)
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Erro inesperado.",
          partial: false
        });
      })
      .finally(() => {
        participacoesPromiseCache.delete(key);
      });

    return () => {
      cancelled = true;
    };
  }, [memo, rodadaAtual]);

  return state;
}
