import type {
  CartolaPontuadosResponse,
  CartolaTeamResponse,
  MergedAtleta
} from "@/lib/cartola/types";

export function mergeTeamWithPontuados(
  team: CartolaTeamResponse,
  pontuados: CartolaPontuadosResponse | null
): MergedAtleta[] {
  const pontosMap = pontuados?.atletas ?? {};
  const capitaoId = team.capitao_id;

  const capitaoMultiplier = 1.5;

  return team.atletas.map((atleta) => {
    const parcial = pontosMap[String(atleta.atleta_id)];
    const pontuacao = parcial?.pontuacao ?? null;
    const isCapitao = atleta.atleta_id === capitaoId;
    const pontuacao_final =
      pontuacao === null
        ? null
        : pontuacao * (isCapitao ? capitaoMultiplier : 1);
    return {
      ...atleta,
      pontuacao,
      pontuacao_final,
      apelido: parcial?.apelido ?? atleta.apelido ?? "Atleta",
      isCapitao
    };
  });
}

export function computeTeamTotal(atletas: MergedAtleta[]) {
  return atletas.reduce((total, atleta) => {
    const base = atleta.pontuacao_final ?? atleta.pontuacao ?? 0;
    return total + base;
  }, 0);
}
