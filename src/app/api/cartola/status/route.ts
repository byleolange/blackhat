import { NextResponse } from "next/server";
import { CARTOLA_API_BASE } from "@/lib/cartola/constants";

export async function GET() {
  const response = await fetch(`${CARTOLA_API_BASE}/mercado/status`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Erro ao buscar status." },
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
