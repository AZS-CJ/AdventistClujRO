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

// returns the date by day of week
// for example for 5, the date of the next friday
export const getNextDate = (dayOfWeek) => {
  const date = new Date()
  date.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7))
  return date
}
