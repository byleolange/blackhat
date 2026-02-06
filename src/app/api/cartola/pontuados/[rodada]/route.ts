import { NextResponse } from "next/server";
import { CARTOLA_API_BASE } from "@/lib/cartola/constants";

type RouteContext = {
  params: { rodada: string };
};

export async function GET(_: Request, { params }: RouteContext) {
  const rodada = Number(params.rodada);

  if (!Number.isFinite(rodada)) {
    return NextResponse.json(
      { error: "Rodada inválida." },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${CARTOLA_API_BASE}/atletas/pontuados/${rodada}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Erro ao buscar pontuados da rodada." },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
