/** Форматирует число как сумму в рублях (значение из API используем как рубли). */
export function formatRub(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Целая и дробная части для отображения как в макете (крупные рубли, мелкие копейки). */
export function splitRubParts(amount: number): { int: string; frac: string } {
  const s = formatRub(amount);
  const parts = s.split(',');
  return {
    int: (parts[0] ?? '').trim(),
    frac: parts[1] ?? '00',
  };
}

export function formatRating(rating: number): string {
  return `${rating.toFixed(1)}/5`;
}
