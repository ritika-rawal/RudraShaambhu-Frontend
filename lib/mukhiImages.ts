const VALID_MUKHI_NUMBERS = new Set(Array.from({ length: 14 }, (_, index) => String(index + 1)));

export function getMukhiImageSrc(mukhi: string | number | undefined, fallback?: string) {
  const normalizedMukhi = String(mukhi ?? "").replace(/\D/g, "");

  if (VALID_MUKHI_NUMBERS.has(normalizedMukhi)) {
    return `/${normalizedMukhi}mukhi.jpg`;
  }

  const src = String(fallback || "").trim();

  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/") ||
    src.startsWith("data:image/")
  ) {
    return src;
  }

  return "/rudra.jpg";
}
