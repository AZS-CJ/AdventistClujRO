import SunCalc from 'suncalc'
import { EventType } from '../data/event'

export function formatToLocalDate(date) {
  return new Date(date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/ \w/, (c) => c.toUpperCase())
}

export function formatToLocalDayName(date) {
  return new Date(date).toLocaleDateString('ro-RO', { weekday: 'long' }).replace(/^\w/, (c) => c.toUpperCase())
}
export function formatToYYYYMMDD(date: Date) {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  return `${date.getFullYear()}-${month}-${day}`
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

export const getFormattedPeriod = (startDate: Date, endDate: Date) => {
  const formattedStartDate = formatToLocalDate(startDate)
  const formattedEndDate = formatToLocalDate(endDate)

  // event is just one day
  if (formattedStartDate === formattedEndDate) return formattedStartDate
  // event is multiple days in the same month
  if (startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth()) return `${startDate.getDate()} - ${formattedEndDate}`
  // event is multiple days in different months
  if (startDate.getFullYear() === endDate.getFullYear()) {
    const dayMonthStart = startDate.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' }).replace(/ \w/, (c) => c.toUpperCase())
    return `${dayMonthStart} - ${formattedEndDate}`
  }
  // event is in different years
  return `${formattedStartDate} - ${formattedEndDate}`
}

export const reorderEvents = (events, isMobile) => {
  // if there are less than 3 events or all are future events don't do anything
  if (events.length < 3 || new Date(events[0].endDate) > new Date()) return events

  let firstFutureEventIndex = 0
  let i = 1
  while (firstFutureEventIndex === 0 && i < events.length) {
    if (new Date(events[i].endDate) > new Date()) {
      // if it's a future/current event
      firstFutureEventIndex = i
    }
    i = i + 1
  }
  if (firstFutureEventIndex === 0) firstFutureEventIndex = events.length - 1
  const futureEvents: EventType[] = events.splice(firstFutureEventIndex, events.length)
  const oldEvents: EventType[] = events.splice(0, firstFutureEventIndex)
  // start with future events then the old events
  const newList: EventType[] = futureEvents.concat(oldEvents)
  // the current event is the middle one(second one)
  if (!isMobile) {
    const lastEl = newList.pop()
    if (lastEl) newList.unshift(lastEl)
  }
  // if all events all past, the active item will be the most recent one
  // if only one event is in the future, that one will be the active item
  // if there are multiple past and multiple future events, the active one will be the first future event
  return newList
}

export const getSummary = (content: string) => {
  return content.length > 150 ? `${content.slice(0, 150)}...` : content
}

const replaceStringList = (str: string, characterList: string[], replaceList: string[]) => {
  let result = str
  characterList.forEach((char, index) => {
    result = result.replaceAll(char, replaceList[index])
  })
  return result
}

export const getUrlFromTitle = (title: string) => {
  let result = title.toLowerCase()
  result = replaceStringList(result, ['ă', 'â', 'î', 'ș', 'ț', ' '], ['a', 'a', 'i', 's', 't', '-'])
  //remove special characters
  result = result.replace(/[^a-z\-]/g, '')
  return result
}
