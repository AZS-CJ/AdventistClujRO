import React, { useEffect, useState } from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { EventType } from '../../data/event'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getEvent } from '../../api/event'
import { getFormattedPeriod } from '../../util/functions'
import BackButton from '../../components/BackButton/BackButton'

import './EventPage.scss'

interface EventState {
  event: EventType | null
  loading: boolean
}

function EventPage() {
  const [eventRequest, setEventRequest] = useState<EventState>({ event: null, loading: true })
  const { backgroundImages } = useGeneralContext()
  const { eventId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  console.log('location.state.name ', location.state)

  useEffect(() => {
    ;(async () => {
      if (!eventId) return
      const event = await getEvent(eventId)
      if (!event) navigate(`/evenimente`)
      else setEventRequest({ event: event, loading: false })
    })()
  }, [])

  const goBack = () => {
    navigate(-1)
  }

  const { loading, event } = eventRequest

  if (loading || !event) return <div className="spinner-border" role="status" />
  return (
    <div className="event-page page-content">
      <div className="background-image" style={{ backgroundImage: `url(${event ? event.largeImg : backgroundImages.home})` }} />
      <BackButton text="Evenimente" onAction={goBack} />
      <div className="left-title-section">
        <span className="bold-title"> {event.title} </span>
        <div className="event-date-type">
          <span>{getFormattedPeriod(event.startDate, event.endDate)}</span>
          <span>{event.type}</span>
        </div>
      </div>
      <div className="event-content">
        <div className="content-intro">{event.intro}</div>
        <div className="content-text">{event.content}</div>
        <BackButton text="Evenimente" onAction={goBack} bottom={true} />
      </div>
      <ScrollToTop />
    </div>
  )
}

export default EventPage
