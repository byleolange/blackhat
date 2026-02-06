"use client";

import * as React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { ConnectTeamCard } from "@/components/cartola/connect-team-card";
import { EmptyState } from "@/components/cartola/empty-state";
import { LoadingSkeleton } from "@/components/cartola/loading-skeleton";
import { ParciaisList } from "@/components/cartola/parciais-list";
import { RefreshButton } from "@/components/cartola/refresh-button";
import { TeamHeader } from "@/components/cartola/team-header";
import { TeamTotals } from "@/components/cartola/team-totals";
import { TeamFieldView } from "@/components/my-team/TeamFieldView";
import { TeamListView } from "@/components/my-team/TeamListView";
import { ViewModeToggle } from "@/components/my-team/ViewModeToggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useCartolaData } from "@/hooks/use-cartola-data";
import { useParticipacoes } from "@/hooks/use-participacoes";
import { useStandalone } from "@/hooks/use-standalone";
import { mergeTeamWithPontuados, computeTeamTotal } from "@/lib/cartola/merge";
import { useCartolaStore } from "@/lib/store/useCartolaStore";

export function AppShell() {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const slug = useCartolaStore((state) => state.slug);
  const clearSlug = useCartolaStore((state) => state.clearSlug);
  const lastUpdated = useCartolaStore((state) => state.lastUpdated);
  const viewMode = useCartolaStore((state) => state.viewMode);
  const isStandalone = useStandalone();

  const { team, pontuados, status, loading, error, refresh } =
    useCartolaData(slug);
  const displaySlug = isHydrated ? slug : null;

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Não foi possível carregar",
        description: error,
        variant: "destructive"
      });
    }
  }, [error]);

  const merged = team && pontuados ? mergeTeamWithPontuados(team, pontuados) : [];
  const sortedTeam = merged
    .slice()
    .sort(
      (a, b) =>
        (b.pontuacao_final ?? b.pontuacao ?? -999) -
        (a.pontuacao_final ?? a.pontuacao ?? -999)
    );
  const total = computeTeamTotal(merged);

  const parciaisList = pontuados
    ? Object.entries(pontuados.atletas)
        .map(([id, atleta]) => ({
          ...atleta,
          atleta_id: Number(id)
        }))
        .sort((a, b) => b.pontuacao - a.pontuacao)
    : [];
  const clubes = pontuados?.clubes ?? {};
  const atletaIds = React.useMemo(
    () => sortedTeam.map((atleta) => atleta.atleta_id),
    [sortedTeam]
  );
  const participacoes = useParticipacoes(atletaIds, status?.rodada_atual);

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-4">
          <div className="flex w-full justify-center">
            <Image
              src="/logotipo.png"
              alt="Logotipo Black Hat"
              width={180}
              height={64}
              priority
            />
          </div>
          {isStandalone ? (
            <div className="flex w-full justify-center sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => window.open(window.location.href, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir no navegador
              </Button>
            </div>
          ) : null}
        </header>

        <Tabs defaultValue="meu-time">
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="meu-time">
              Meu Time
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="parciais">
              Parciais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meu-time" className="space-y-4">
            {displaySlug ? (
              <div className="flex items-center justify-end">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={clearSlug}>
                    Trocar time
                  </Button>
                  <RefreshButton onClick={refresh} loading={loading} />
                </div>
              </div>
            ) : null}

            {!displaySlug ? <ConnectTeamCard /> : null}

            {displaySlug && loading ? <LoadingSkeleton /> : null}

            {displaySlug && !loading && team && pontuados ? (
              <div className="space-y-4">
                <TeamHeader
                  time={team.time.nome}
                  cartoleiro={team.nome_cartola}
                  rodada={status?.rodada_atual}
                  statusMercado={status?.status_mercado}
                />
                <TeamTotals total={total} lastUpdated={lastUpdated} />
                <div className="flex items-center justify-end">
                  {isHydrated ? <ViewModeToggle /> : null}
                </div>
                {sortedTeam.length ? (
                  (isHydrated ? viewMode : "list") === "field" ? (
                    <TeamFieldView atletas={merged} />
                  ) : (
                    <TeamListView
                      atletas={sortedTeam}
                      clubes={clubes}
                      participacoes={participacoes.data}
                      participacoesLoading={
                        participacoes.loading || participacoes.partial
                      }
                    />
                  )
                ) : (
                  <EmptyState
                    title="Sem atletas pontuados"
                    description="As parciais ainda não estão disponíveis para o seu time."
                  />
                )}
              </div>
            ) : null}

            {displaySlug && !loading && error ? (
              <EmptyState
                title="Erro ao carregar seu time"
                description="Tente novamente em alguns instantes."
              />
            ) : null}
          </TabsContent>

          <TabsContent value="parciais" className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Lista geral de parciais
              </p>
              <RefreshButton onClick={refresh} loading={loading} />
            </div>

            {loading ? <LoadingSkeleton /> : null}

            {!loading && parciaisList.length ? (
              <ParciaisList atletas={parciaisList} clubes={clubes} />
            ) : null}

            {!loading && !parciaisList.length ? (
              <EmptyState
                title="Sem parciais disponíveis"
                description="As parciais ainda não foram liberadas."
              />
            ) : null}
          </TabsContent>
        </Tabs>

        <footer className="text-center text-xs text-muted-foreground">
          Este aplicativo não é afiliado à Globo ou ao Cartola FC.
        </footer>
      </div>
    </main>
  );
}
