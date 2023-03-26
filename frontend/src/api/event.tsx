import axios from 'axios'
import qs from 'qs'
import { EventType } from '../data/event'
import { EVENT_CAROUSEL_LIMIT, PAGE_SIZE } from '../util/constants'

export const getLastEvents = () => {
  const pagination = { limit: EVENT_CAROUSEL_LIMIT }
  const sort = 'startDate:asc'
  return getEvents(pagination, sort)
}

export const getPaginatedEvents = (page: number) => {
  const pagination = {
    page: page,
    pageSize: PAGE_SIZE
  }
  const sort = 'startDate:desc'
  return getEvents(pagination, sort)
}

const getEvents: (pagination, sort: string) => Promise<{ events: EventType[]; pageCount: number }> = async (pagination, sort) => {
  const query = qs.stringify(
    {
      sort: sort,
      pagination: pagination,
      populate: '*'
    },
    {
      encodeValuesOnly: true // prettify URL
    }
  )
  const url = `/api/events?${query}`
  return axios
    .get(url)
    .then((response) => {
      const eventList = response.data.data.map((event) => buildEvent(event.id, event.attributes))
      return { events: eventList, pageCount: response.data.meta.pagination.pageCount }
    })
    .catch((error) => {
      console.log('Error when loading the events ', error)
      return { events: [], pageCount: 0 }
    })
}

export const getEvent: (id: string) => Promise<EventType | null> = async (id: string) => {
  const url = `/api/events/${id}?populate=*`
  return axios
    .get(url)
    .then((response) => buildEvent(response.data.data.id, response.data.data.attributes))
    .catch((error) => {
      console.log('Error when loading Event ', error)
      return null
    })
}

const buildEvent = (id: number, attributes): EventType => {
  return {
    id: id,
    title: attributes.title,
    startDate: new Date(attributes.startDate),
    endDate: new Date(attributes.endDate),
    type: attributes.type,
    smallImg: attributes.cover.data ? attributes.cover.data.attributes.formats?.small?.url : '',
    largeImg: attributes.cover.data ? attributes.cover.data.attributes.formats?.large?.url : '',
    intro: attributes.intro || '',
    content: attributes.content || '',
    facebookLink: attributes.facebookLink
  }
}
