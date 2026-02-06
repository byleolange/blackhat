export type ParticipacoesResponse = {
  rodada: number;
  participacoes: Record<string, number>;
  partial?: boolean;
};

export function normalizeParticipacoes(
  response: ParticipacoesResponse
): Record<number, number> {
  const normalized: Record<number, number> = {};
  Object.entries(response.participacoes ?? {}).forEach(([id, value]) => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;
    normalized[numericId] = value;
  });
  return normalized;
}
