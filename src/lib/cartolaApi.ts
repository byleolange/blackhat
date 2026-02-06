import { CARTOLA_API_BASE } from "@/lib/cartola/constants";
import { LRUCache } from "@/lib/cache";
import type {
  CartolaAtletasMercadoResponse,
  CartolaClube,
  CartolaMercadoAtleta,
  CartolaPontuadosResponse,
  CartolaPontuadosByRodadaResponse,
  CartolaRodada,
  CartolaStatusResponse
} from "@/lib/cartola/types";

const clubesCache: {
  value: Record<string, CartolaClube> | null;
  promise: Promise<Record<string, CartolaClube>> | null;
} = {
  value: null,
  promise: null
};

const rodadasCache: {
  value: CartolaRodada[] | null;
  promise: Promise<CartolaRodada[]> | null;
} = {
  value: null,
  promise: null
};

const atletasCache: {
  value: CartolaMercadoAtleta[] | null;
  promise: Promise<CartolaMercadoAtleta[]> | null;
} = {
  value: null,
  promise: null
};

// LRU Caches with size limits to prevent memory leaks
const pontuadosCache = new LRUCache<number, CartolaPontuadosByRodadaResponse>(50);
const pontuadosPartialCache = new LRUCache<number, CartolaPontuadosByRodadaResponse>(50);
const pontuadosPromiseCache = new Map<
  number,
  Promise<CartolaPontuadosByRodadaResponse>
>();
let parciaisCache: CartolaPontuadosResponse | null = null;
let parciaisPromise: Promise<CartolaPontuadosResponse> | null = null;

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Cartola API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function fetchJsonWithStatus<T>(
  url: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data?: T }> {
  const response = await fetch(url, init);
  if (!response.ok) {
    return { ok: false, status: response.status };
  }
  const data = (await response.json()) as T;
  return { ok: true, status: response.status, data };
}

export async function fetchMercadoStatus() {
  return fetchJson<CartolaStatusResponse>(`${CARTOLA_API_BASE}/mercado/status`, {
    next: { revalidate: 60 }
  });
}

export async function fetchRodadas() {
  if (rodadasCache.value) return rodadasCache.value;
  if (rodadasCache.promise) return rodadasCache.promise;

  rodadasCache.promise = fetchJson<CartolaRodada[]>(
    `${CARTOLA_API_BASE}/rodadas`,
    { next: { revalidate: 60 } }
  )
    .then((data) => {
      rodadasCache.value = data;
      return data;
    })
    .finally(() => {
      rodadasCache.promise = null;
    });

  return rodadasCache.promise;
}

export async function fetchClubes() {
  if (clubesCache.value) return clubesCache.value;
  if (clubesCache.promise) return clubesCache.promise;

  clubesCache.promise = fetchJson<Record<string, CartolaClube>>(
    `${CARTOLA_API_BASE}/clubes`,
    { next: { revalidate: 60 } }
  )
    .then((data) => {
      clubesCache.value = data;
      return data;
    })
    .finally(() => {
      clubesCache.promise = null;
    });

  return clubesCache.promise;
}

export async function fetchAtletasMercado() {
  if (atletasCache.value) return atletasCache.value;
  if (atletasCache.promise) return atletasCache.promise;

  atletasCache.promise = fetchJson<CartolaAtletasMercadoResponse>(
    `${CARTOLA_API_BASE}/atletas/mercado`,
    { next: { revalidate: 60 } }
  )
    .then((data) => {
      atletasCache.value = data.atletas ?? [];
      return atletasCache.value;
    })
    .finally(() => {
      atletasCache.promise = null;
    });

  return atletasCache.promise;
}

export type PontuadosResult = {
  data: CartolaPontuadosByRodadaResponse;
  isPartial: boolean;
};

export async function fetchPontuadosParciais() {
  if (parciaisCache) return parciaisCache;
  if (parciaisPromise) return parciaisPromise;

  parciaisPromise = fetchJson<CartolaPontuadosResponse>(
    buildPontuadosParciaisUrl(),
    { cache: "no-store" }
  )
    .then((data) => {
      parciaisCache = data;
      return data;
    })
    .finally(() => {
      parciaisPromise = null;
    });

  return parciaisPromise;
}

export async function fetchPontuadosByRodada(
  rodada: number,
  options?: { allowFallback?: boolean }
): Promise<PontuadosResult> {
  const cached = pontuadosCache.get(rodada);
  if (cached) return { data: cached, isPartial: false };
  const partialCached = pontuadosPartialCache.get(rodada);
  if (partialCached) return { data: partialCached, isPartial: true };

  const inflight = pontuadosPromiseCache.get(rodada);
  if (inflight) return inflight.then((data) => ({ data, isPartial: false }));

  const promise = (async () => {
    const attempt = await fetchJsonWithStatus<CartolaPontuadosByRodadaResponse>(
      buildPontuadosByRodadaUrl(rodada),
      { cache: "no-store" }
    );

    if (attempt.ok && attempt.data) {
      pontuadosCache.set(rodada, attempt.data);
      return attempt.data;
    }

    if (options?.allowFallback && attempt.status === 500) {
      const parciais = await fetchPontuadosParciais();
      pontuadosPartialCache.set(rodada, parciais);
      return parciais;
    }

    throw new Error(`Cartola API error: ${attempt.status}`);
  })()
    .finally(() => {
      pontuadosPromiseCache.delete(rodada);
    });

  pontuadosPromiseCache.set(rodada, promise);
  const data = await promise;
  return { data, isPartial: pontuadosPartialCache.has(rodada) };
}
const isBrowser = typeof window !== "undefined";

function buildPontuadosByRodadaUrl(rodada: number) {
  return isBrowser
    ? `/api/cartola/pontuados/${rodada}`
    : `${CARTOLA_API_BASE}/atletas/pontuados/${rodada}`;
}

function buildPontuadosParciaisUrl() {
  return isBrowser
    ? "/api/cartola/pontuados"
    : `${CARTOLA_API_BASE}/atletas/pontuados`;
}
