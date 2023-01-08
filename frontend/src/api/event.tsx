import axios from 'axios'
import qs from 'qs'
import { EventType } from '../data/event'

const eventsLimit = 7

const getEvents: () => Promise<EventType[]> = async () => {
  const query = qs.stringify(
    {
      sort: 'startDate:asc',
      pagination: {
        limit: eventsLimit
      },
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
      return response.data.data.map((event) => {
        const attrs = event.attributes
        return {
          id: event.id,
          title: attrs.title,
          startDate: attrs.startDate,
          endDate: attrs.endDate,
          type: attrs.type,
          smallImg: attrs.cover.data ? attrs.cover.data.attributes.formats.small.url : '',
          largeImg: attrs.cover.data ? attrs.cover.data.attributes.formats.large.url : '',
          content: attrs.content
        }
      })
    })
    .catch((err) => {
      console.log(err)
      return []
    })
}

export default getEvents
