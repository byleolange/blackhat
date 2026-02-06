"use client";

import * as React from "react";

import { PlayerHeader } from "@/components/player/PlayerHeader";
import { RodadaSelect } from "@/components/player/RodadaSelect";
import { ScoutsCard } from "@/components/player/ScoutsCard";
import {
  fetchPontuadosByRodada,
  fetchPontuadosParciais
} from "@/lib/cartolaApi";
import { useParticipacoes } from "@/hooks/use-participacoes";
import type {
  CartolaClube,
  CartolaMercadoAtleta,
  CartolaRodada
} from "@/lib/cartola/types";

const gamesCountCache = new Map<number, number>();

type PlayerPageClientProps = {
  atleta: CartolaMercadoAtleta;
  clubes: Record<string, CartolaClube>;
  rodadas: CartolaRodada[];
  rodadaAtual: number;
};

export function PlayerPageClient({
  atleta,
  clubes,
  rodadas,
  rodadaAtual
}: PlayerPageClientProps) {
  const [displayAtleta, setDisplayAtleta] =
    React.useState<CartolaMercadoAtleta>(atleta);
  const clube = displayAtleta.clube_id
    ? clubes[String(displayAtleta.clube_id)]
    : null;
  const rodadasOptions = React.useMemo(
    () =>
      rodadas.map((rodada) => ({
        value: rodada.rodada_id,
        label: rodada.nome ? rodada.nome : `Rodada ${rodada.rodada_id}`
      })),
    [rodadas]
  );

  const [selectedRodada, setSelectedRodada] = React.useState<number>(
    rodadaAtual || rodadasOptions[0]?.value || 1
  );
  const [scoutsLoading, setScoutsLoading] = React.useState(true);
  const [scoutsData, setScoutsData] =
    React.useState<Record<string, number> | null>(null);
  const [jogadorJogou, setJogadorJogou] = React.useState(false);
  const [isPartial, setIsPartial] = React.useState(false);
  const participacoes = useParticipacoes(
    [displayAtleta.atleta_id],
    rodadaAtual
  );
  const jogosLoading = participacoes.loading;
  const jogosCount =
    gamesCountCache.get(displayAtleta.atleta_id) ??
    participacoes.data?.[displayAtleta.atleta_id] ??
    null;

  React.useEffect(() => {
    let cancelled = false;
    setScoutsLoading(true);
    setIsPartial(false);

    const shouldUseParciais = selectedRodada === rodadaAtual;

    const promise = shouldUseParciais
      ? fetchPontuadosParciais().then((data) => ({
        data,
        isPartial: true
      }))
      : fetchPontuadosByRodada(selectedRodada, {
        allowFallback: selectedRodada === rodadaAtual
      });

    promise
      .then((result) => {
        if (cancelled) return;
        const payload = result.data;
        const atletaData =
          payload.atletas?.[String(displayAtleta.atleta_id)] ?? null;
        // Type guard: CartolaPontuadosResponse has 'pontuacao', CartolaPontuadosByRodadaResponse has 'scout'
        const scout = atletaData && 'scout' in atletaData ? (atletaData.scout ?? {}) : {};
        const jogou = Boolean(atletaData);

        const gsValue = Number(scout.GS ?? 0);
        const sgValue =
          // SG é calculado no client conforme a regra.
          jogou &&
            (displayAtleta.posicao_id === 1 ||
              displayAtleta.posicao_id === 2 ||
              displayAtleta.posicao_id === 3) &&
            gsValue === 0
            ? 1
            : 0;

        setJogadorJogou(jogou);
        setIsPartial(result.isPartial);
        setScoutsData(jogou ? { ...scout, SG: sgValue } : null);
        setScoutsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar scouts:", error);
        if (cancelled) return;
        setJogadorJogou(false);
        setScoutsData(null);
        setIsPartial(false);
        setScoutsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedRodada, displayAtleta.atleta_id, displayAtleta.posicao_id, rodadaAtual]);

  React.useEffect(() => {
    setDisplayAtleta(atleta);
  }, [atleta]);

  React.useEffect(() => {
    if (displayAtleta.apelido || displayAtleta.nome) return;
    let cancelled = false;

    fetchPontuadosParciais()
      .then((payload) => {
        if (cancelled) return;
        const parciaisAtleta =
          payload.atletas?.[String(displayAtleta.atleta_id)];
        if (!parciaisAtleta) return;
        setDisplayAtleta((current) => ({
          ...current,
          apelido: parciaisAtleta.apelido ?? current.apelido,
          clube_id: parciaisAtleta.clube_id ?? current.clube_id,
          posicao_id: parciaisAtleta.posicao_id ?? current.posicao_id
        }));
      })
      .catch(() => {
        // Sem fallback adicional.
      });

    return () => {
      cancelled = true;
    };
  }, [displayAtleta.apelido, displayAtleta.nome, displayAtleta.atleta_id]);

  React.useEffect(() => {
    if (
      typeof participacoes.data?.[displayAtleta.atleta_id] !== "number" ||
      participacoes.partial
    ) {
      return;
    }
    gamesCountCache.set(
      displayAtleta.atleta_id,
      participacoes.data[displayAtleta.atleta_id]
    );
  }, [displayAtleta.atleta_id, participacoes.data, participacoes.partial]);

  return (
    <div className="space-y-4">
      <PlayerHeader
        atleta={displayAtleta}
        clube={clube}
        jogos={jogosCount}
        jogosLoading={jogosLoading}
      />

      <RodadaSelect
        value={selectedRodada}
        options={rodadasOptions}
        onChange={setSelectedRodada}
      />

      <ScoutsCard
        loading={scoutsLoading}
        scouts={scoutsData}
        jogadorJogou={jogadorJogou}
        isPartial={isPartial}
      />
    </div>
  );
}
