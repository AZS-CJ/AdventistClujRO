export function formatToLocalDate(date) {
  return new Date(date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
export const range = (from, to, step = 1) => {
  let i = from
  const range: number[] = []

  while (i <= to) {
    range.push(i)
    i += step
  }

  return range
}
