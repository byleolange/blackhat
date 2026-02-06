import { PlayerPageClient } from "@/components/player/PlayerPageClient";
import { buttonVariants } from "@/components/ui/button";
import {
  fetchAtletasMercado,
  fetchClubes,
  fetchMercadoStatus,
  fetchPontuadosParciais,
  fetchRodadas
} from "@/lib/cartolaApi";

type PlayerPageProps = {
  params: { atletaId: string };
  searchParams?: {
    apelido?: string | string[];
    nome?: string | string[];
    clube_id?: string | string[];
    posicao_id?: string | string[];
  };
};

function getParam(value: string | string[] | undefined) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function PlayerPage({
  params,
  searchParams
}: PlayerPageProps) {
  const atletaId = Number(params.atletaId);

  if (!Number.isFinite(atletaId)) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <a href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Voltar
          </a>
          <p className="text-sm text-muted-foreground">
            Jogador não encontrado.
          </p>
        </div>
      </main>
    );
  }

  const [status, rodadas, clubes, atletas] = await Promise.all([
    fetchMercadoStatus(),
    fetchRodadas(),
    fetchClubes(),
    fetchAtletasMercado()
  ]);

  const atleta = atletas.find((item) => item.atleta_id === atletaId);
  let atletaFromParciais:
    | {
      atleta_id: number;
      apelido?: string;
      clube_id?: number;
      posicao_id?: number;
    }
    | null = null;

  if (!atleta) {
    try {
      const parciais = await fetchPontuadosParciais();
      const parciaisAtleta = parciais.atletas?.[String(atletaId)];
      if (parciaisAtleta) {
        atletaFromParciais = {
          atleta_id: atletaId,
          apelido: parciaisAtleta.apelido,
          clube_id: parciaisAtleta.clube_id,
          posicao_id: parciaisAtleta.posicao_id
        };
      }
    } catch {
      // Sem fallback por parciais.
    }
  }
  const apelido = getParam(searchParams?.apelido);
  const nome = getParam(searchParams?.nome);
  const clubeIdParam = getParam(searchParams?.clube_id);
  const posicaoIdParam = getParam(searchParams?.posicao_id);
  const fallbackAtleta =
    !atleta && (apelido || nome || clubeIdParam || posicaoIdParam)
      ? {
        atleta_id: atletaId,
        apelido,
        nome,
        clube_id: clubeIdParam ? Number(clubeIdParam) : undefined,
        posicao_id: posicaoIdParam ? Number(posicaoIdParam) : undefined
      }
      : null;

  const resolvedAtleta =
    atleta ??
    atletaFromParciais ??
    fallbackAtleta ?? { atleta_id: atletaId };

  const rodadaAtual = status?.rodada_atual ?? rodadas[0]?.rodada_id ?? 1;

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <a href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Voltar
        </a>
        <PlayerPageClient
          atleta={resolvedAtleta}
          clubes={clubes}
          rodadas={rodadas}
          rodadaAtual={rodadaAtual}
        />
      </div>
    </main>
  );
}
