import SunCalc from 'suncalc'

export function formatToLocalDate(date) {
  return new Date(date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/ \w/, (c) => c.toUpperCase())
}

export function formatToLocalDayName(date) {
  return new Date(date).toLocaleDateString('ro-RO', { weekday: 'long' }).replace(/^\w/, (c) => c.toUpperCase())
}

export function formatTime(time: string) {
  const hours = time.substring(0, 2)
  const minutes = time.substring(3, 5)
  return `${hours}:${minutes}`
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
// for example for 6, the date of the next friday (1-sunday)
export const getNextDate = (dayOfWeek) => {
  const date = new Date()
  // if today is saturday, consider that today is friday
  if (date.getDay() == 6) date.setDate(date.getDate() - 1)
  date.setDate(date.getDate() + ((dayOfWeek + 6 - date.getDay()) % 7))
  return date
}

export const getDayName = (dayNumber) => {
  switch (dayNumber) {
    case 1:
      return 'Duminica'
    case 2:
      return 'Luni'
    case 3:
      return 'Marti'
    case 4:
      return 'Miercuri'
    case 5:
      return 'Joi'
    case 6:
      return 'Vineri'
    default:
      return 'Sambata'
  }
}

//sunset time in Cluj-Napoca
export const getSunsetForDay = (date) => {
  const times = SunCalc.getTimes(date, 46.763, 23.58)
  return `${times.sunset.getHours()}:${times.sunset.getMinutes() < 10 ? '0' : ''}${times.sunset.getMinutes()}`
}
