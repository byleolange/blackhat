import { NextResponse } from "next/server";

import { CARTOLA_API_BASE } from "@/lib/cartola/constants";
import { TTLCache } from "@/lib/cache";
import type { CartolaPontuadosByRodadaResponse } from "@/lib/cartola/types";

const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS) || 60 * 1000;
const BATCH_SIZE = 5;

// TTL Caches with automatic expiration and size limits
const pontuadosCache = new TTLCache<number, CartolaPontuadosByRodadaResponse>(
  100,
  CACHE_TTL_MS
);
const agregadosCache = new TTLCache<
  string,
  { participacoes: Record<string, number>; partial: boolean }
>(100, CACHE_TTL_MS);

async function fetchPontuadosRodada(
  rodada: number
): Promise<CartolaPontuadosByRodadaResponse> {
  const cached = pontuadosCache.get(rodada);
  if (cached) return cached;

  const response = await fetch(
    `${CARTOLA_API_BASE}/atletas/pontuados/${rodada}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar pontuados (${rodada})`);
  }

  const data = (await response.json()) as CartolaPontuadosByRodadaResponse;
  pontuadosCache.set(rodada, data);
  return data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rodadaParam = searchParams.get("rodada");
  const idsParam = searchParams.get("atleta_ids");

  const rodadaAtual = rodadaParam ? Number(rodadaParam) : NaN;
  if (!Number.isFinite(rodadaAtual) || rodadaAtual < 1) {
    return NextResponse.json(
      { error: "Rodada inválida." },
      { status: 400 }
    );
  }

  if (!idsParam) {
    return NextResponse.json(
      { error: "Parâmetro atleta_ids é obrigatório." },
      { status: 400 }
    );
  }

  const ids = Array.from(
    new Set(
      idsParam
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => Number.isFinite(id))
    )
  );

  if (!ids.length) {
    return NextResponse.json(
      { error: "Nenhum atleta válido informado." },
      { status: 400 }
    );
  }

  const idsKey = ids.slice().sort((a, b) => a - b).join(",");
  const cacheKey = `${rodadaAtual}:${idsKey}`;
  const cachedAgg = agregadosCache.get(cacheKey);
  if (cachedAgg) {
    return NextResponse.json({
      rodada: rodadaAtual,
      participacoes: cachedAgg.participacoes,
      partial: cachedAgg.partial
    });
  }

  const idsSet = new Set(ids.map((id) => String(id)));
  const participacoes: Record<string, number> = {};
  ids.forEach((id) => {
    participacoes[String(id)] = 0;
  });

  let partial = false;

  for (let start = 1; start <= rodadaAtual; start += BATCH_SIZE) {
    const end = Math.min(rodadaAtual, start + BATCH_SIZE - 1);
    const batch: Promise<CartolaPontuadosByRodadaResponse>[] = [];

    for (let rodada = start; rodada <= end; rodada += 1) {
      batch.push(
        fetchPontuadosRodada(rodada).catch(() => {
          partial = true;
          return { atletas: {} } as CartolaPontuadosByRodadaResponse;
        })
      );
    }

    const payloads = await Promise.all(batch);

    payloads.forEach((payload) => {
      Object.entries(payload.atletas ?? {}).forEach(([id, atleta]) => {
        if (!idsSet.has(id)) return;
        if (atleta && atleta.jogou === false) return;
        participacoes[id] = (participacoes[id] ?? 0) + 1;
      });
    });
  }

  agregadosCache.set(cacheKey, { participacoes, partial });

  return NextResponse.json({
    rodada: rodadaAtual,
    participacoes,
    partial
  });
}
