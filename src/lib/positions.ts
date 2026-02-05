import type { MergedAtleta } from "@/lib/cartola/types";

export type PositionKey = "gk" | "def" | "lat" | "mid" | "fwd" | "coach";

export type PositionLine = {
  key: PositionKey;
  label: string;
  posicaoIds: number[];
  max: number;
};

export const POSITION_LINES: PositionLine[] = [
  { key: "gk", label: "Goleiro", posicaoIds: [1], max: 1 },
  { key: "def", label: "Zagueiros", posicaoIds: [3], max: 2 },
  { key: "lat", label: "Laterais", posicaoIds: [2], max: 2 },
  { key: "mid", label: "Meias", posicaoIds: [4], max: 3 },
  { key: "fwd", label: "Atacantes", posicaoIds: [5], max: 3 },
  { key: "coach", label: "Técnico", posicaoIds: [6], max: 1 }
];

const POSITION_MAP = POSITION_LINES.reduce<Record<number, PositionKey>>(
  (acc, line) => {
    line.posicaoIds.forEach((id) => {
      acc[id] = line.key;
    });
    return acc;
  },
  {}
);

export function groupPlayersByPosition(atletas: MergedAtleta[]) {
  const grouped: Record<PositionKey, MergedAtleta[]> = {
    gk: [],
    def: [],
    lat: [],
    mid: [],
    fwd: [],
    coach: []
  };

  atletas.forEach((atleta) => {
    const posicaoId = atleta.posicao_id;
    if (!posicaoId) return;
    const key = POSITION_MAP[posicaoId];
    if (!key) return;
    grouped[key].push(atleta);
  });

  POSITION_LINES.forEach((line) => {
    grouped[line.key] = grouped[line.key].slice(0, line.max);
  });

  return grouped;
}

export function getPositionShort(posicaoId?: number) {
  switch (posicaoId) {
    case 1:
      return "GK";
    case 2:
      return "LAT";
    case 3:
      return "ZAG";
    case 4:
      return "MEI";
    case 5:
      return "ATA";
    case 6:
      return "TEC";
    default:
      return "POS";
  }
}
