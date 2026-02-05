export function formatPoints(points: number | null) {
  if (points === null || Number.isNaN(points)) return "—";
  return points.toFixed(2).replace(".", ",");
}
