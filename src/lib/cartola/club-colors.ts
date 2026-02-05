export type ClubColors = {
  primary: string;
  secondary: string;
};

const BY_ID: Record<number, ClubColors> = {
  262: { primary: "#c8102e", secondary: "#000000" }, // Flamengo
  263: { primary: "#000000", secondary: "#ffffff" }, // Botafogo
  264: { primary: "#000000", secondary: "#ffffff" }, // Corinthians
  265: { primary: "#0033a0", secondary: "#c8102e" }, // Bahia
  266: { primary: "#7a0019", secondary: "#007a3d" }, // Fluminense
  267: { primary: "#000000", secondary: "#ffffff" }, // Vasco
  275: { primary: "#1d7a4f", secondary: "#1d7a4f" }, // Palmeiras
  276: { primary: "#c8102e", secondary: "#ffffff" }, // Sao Paulo
  277: { primary: "#ffffff", secondary: "#000000" }, // Santos
  280: { primary: "#ffffff", secondary: "#d71920" }, // Bragantino
  282: { primary: "#000000", secondary: "#ffffff" }, // Atletico-MG
  283: { primary: "#0033a0", secondary: "#ffffff" }, // Cruzeiro
  284: { primary: "#1c3b87", secondary: "#000000" }, // Gremio
  285: { primary: "#d00027", secondary: "#ffffff" }, // Internacional
  287: { primary: "#c8102e", secondary: "#000000" }, // Vitoria
  293: { primary: "#000000", secondary: "#c8102e" }, // Athletico-PR
  294: { primary: "#006c35", secondary: "#ffffff" }, // Coritiba
  315: { primary: "#006c35", secondary: "#ffffff" }, // Chapecoense
  364: { primary: "#0b1f3a", secondary: "#ffffff" }, // Remo
  2305: { primary: "#f5c542", secondary: "#006437" } // Mirassol
};

export function getClubColorsById(id?: number | null) {
  if (!id) return null;
  return BY_ID[id] ?? null;
}
