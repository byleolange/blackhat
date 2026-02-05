import { NextResponse } from "next/server";
import { CARTOLA_API_BASE } from "@/lib/cartola/constants";
import { isCartolaId } from "@/lib/cartola/parse";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("slug");

  if (!key) {
    return NextResponse.json(
      { error: "Identificador do time é obrigatório." },
      { status: 400 }
    );
  }

  const encoded = encodeURIComponent(key);
  const endpoints = isCartolaId(key)
    ? [`${CARTOLA_API_BASE}/time/id/${encoded}`, `${CARTOLA_API_BASE}/time/slug/${encoded}`]
    : [`${CARTOLA_API_BASE}/time/slug/${encoded}`];

  let response: Response | null = null;
  for (const endpoint of endpoints) {
    const attempt = await fetch(endpoint, { cache: "no-store" });
    if (attempt.ok) {
      response = attempt;
      break;
    }
    response = attempt;
  }

  if (!response || !response.ok) {
    return NextResponse.json(
      { error: "Time não encontrado." },
      { status: response ? response.status : 502 }
    );
  }

  const data = await response.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
