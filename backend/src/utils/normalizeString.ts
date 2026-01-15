export function normalizeString(
  value: string | null | undefined
): string | null {
  return value && value.trim() !== "" ? value : null;
}
