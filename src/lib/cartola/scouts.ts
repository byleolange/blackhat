/**
 * Scout labels and descriptions for Cartola FC
 * Maps scout codes to their full names
 */

export type ScoutInfo = {
    code: string;
    label: string;
    isPositive: boolean;
};

export const SCOUT_LABELS: Record<string, ScoutInfo> = {
    // Positive scouts
    DS: { code: "DS", label: "Desarme", isPositive: true },
    G: { code: "G", label: "Gol", isPositive: true },
    A: { code: "A", label: "Assistência", isPositive: true },
    SG: { code: "SG", label: "Saldo de Gols (sem sofrer gol)", isPositive: true },
    FS: { code: "FS", label: "Falta Sofrida", isPositive: true },
    FF: { code: "FF", label: "Finalização para Fora", isPositive: true },
    FD: { code: "FD", label: "Finalização Defendida", isPositive: true },
    FT: { code: "FT", label: "Finalização na Trave", isPositive: true },
    PS: { code: "PS", label: "Pênalti Sofrido", isPositive: true },
    DE: { code: "DE", label: "Defesa", isPositive: true },
    DP: { code: "DP", label: "Defesa de Pênalti", isPositive: true },

    // Negative scouts
    GC: { code: "GC", label: "Gol Contra", isPositive: false },
    CV: { code: "CV", label: "Cartão Vermelho", isPositive: false },
    CA: { code: "CA", label: "Cartão Amarelo", isPositive: false },
    GS: { code: "GS", label: "Gol Sofrido", isPositive: false },
    PP: { code: "PP", label: "Pênalti Perdido", isPositive: false },
    PC: { code: "PC", label: "Pênalti Cometido", isPositive: false },
    FC: { code: "FC", label: "Falta Cometida", isPositive: false },
    I: { code: "I", label: "Impedimento", isPositive: false }
};

export const POSITIVE_SCOUTS = [
    "DS",
    "G",
    "A",
    "SG",
    "FS",
    "FF",
    "FD",
    "FT",
    "PS",
    "DE",
    "DP"
] as const;

export const NEGATIVE_SCOUTS = [
    "GC",
    "CV",
    "CA",
    "GS",
    "PP",
    "PC",
    "FC",
    "I"
] as const;

export function getScoutLabel(code: string): string {
    return SCOUT_LABELS[code]?.label ?? code;
}
