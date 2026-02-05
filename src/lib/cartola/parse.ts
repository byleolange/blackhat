export function isCartolaId(value: string): boolean {
  return /^\d+$/.test(value.trim());
}

function normalizeTeamName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (isCartolaId(trimmed)) return trimmed;

  return trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function extractFromPath(path: string): string | null {
  const match = path.match(/(?:^|\/|#)!?\/time\/([^/?#]+)/i);
  if (match?.[1]) return match[1];
  return null;
}

export function parseCartolaInput(raw: string | null): string | null {
  if (!raw) return null;
  const input = raw.trim();
  if (!input) return null;

  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input);
      const fromHash = extractFromPath(url.hash);
      if (fromHash) return fromHash;
      const fromPath = extractFromPath(url.pathname);
      if (fromPath) return fromPath;
    } catch {
      // Ignore URL parsing errors and fall back to raw input.
    }
  }

  const embedded = extractFromPath(input);
  if (embedded) return embedded;

  return normalizeTeamName(input);
}
