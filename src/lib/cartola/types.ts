export type CartolaTeamAtleta = {
  atleta_id: number;
  apelido?: string;
  posicao_id?: number;
  clube_id?: number;
};

export type CartolaTeamResponse = {
  time: {
    time_id: number;
    nome: string;
    slug: string;
  };
  nome_cartola: string;
  atletas: CartolaTeamAtleta[];
  capitao_id: number;
};

export type CartolaPontuado = {
  atleta_id: number;
  apelido: string;
  pontuacao: number;
  posicao_id: number;
  clube_id: number;
};

export type CartolaPontuadosResponse = {
  atletas: Record<string, CartolaPontuado>;
  clubes?: Record<string, CartolaClube>;
};

export type CartolaStatusResponse = {
  rodada_atual: number;
  status_mercado?: number;
};

export type CartolaClube = {
  id: number;
  nome: string;
  abreviacao: string;
  escudos: {
    "30x30"?: string;
    "45x45"?: string;
    "60x60"?: string;
  };
};

export type MergedAtleta = CartolaTeamAtleta & {
  pontuacao: number | null;
  pontuacao_final: number | null;
  apelido: string;
  isCapitao: boolean;
};
