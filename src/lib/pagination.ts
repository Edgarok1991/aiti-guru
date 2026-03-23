/** Номера страниц с многоточием для большого числа страниц. */
export function getPaginationRange(
  current: number,
  total: number,
): (number | 'ellipsis')[] {
  if (total <= 0) return [];
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const delta = 2;
  const range: number[] = [];
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  const out: (number | 'ellipsis')[] = [1];

  if (range[0]! > 2) {
    out.push('ellipsis');
  }

  out.push(...range);

  if (range[range.length - 1]! < total - 1) {
    out.push('ellipsis');
  }

  out.push(total);

  return out;
}
