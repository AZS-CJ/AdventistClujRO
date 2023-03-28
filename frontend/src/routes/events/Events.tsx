import React, { useEffect, useState } from 'react'
import NumberPagination from '../../components/NumberPagination/NumberPagination'
import { getFormattedPeriod, getSummary, getUrlFromTitle } from '../../util/functions'
import { useGeneralContext } from '../../contexts/generalState'
import { getPaginatedEvents } from '../../api/event'
import { EventType } from '../../data/event'
import { useNavigate } from 'react-router-dom'

import './Events.scss'

interface EventState {
  events: EventType[]
  loading: boolean
}

function Events() {
  const [eventRequest, setEventRequest] = useState<EventState>({ events: [], loading: true })
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const { backgroundImages } = useGeneralContext()
  const navigate = useNavigate()

  useEffect(() => {
    window.scroll({ top: 0, behavior: 'smooth' })
    setEventRequest({ events: [], loading: true })
    getPaginatedEvents(page).then((response) => {
      setEventRequest({ events: response.events, loading: false })
      setTotalPages(response.pageCount)
    })
  }, [page])

  const goToEventPage = (event: EventType) => {
    const url = `/evenimente/${event.id}-${getUrlFromTitle(event.title)}`
    navigate(url, { state: { from: 'events' } })
  }

  const { loading, events } = eventRequest

  const renderEventContainer = () => {
    return (
      <div className="event-wrapper default-container">
        {events.map((event) => {
          return (
            <div className="event-card" key={event.id} onClick={() => goToEventPage(event)}>
              <div className="cover-img">
                <img src={`${event.smallImg}`} alt="cover" />
              </div>
              <div className="event-card-content">
                <div className="event-title">{event.title}</div>
                <div className="event-date-type">
                  <span>{getFormattedPeriod(event.startDate, event.endDate)}</span>
                  <span>{event.type}</span>
                </div>
                <div className="event-content">{getSummary(event.intro)}</div>
              </div>
            </div>
          )
        })}
        <NumberPagination totalPages={totalPages} currentPage={page} setPage={setPage} />
      </div>
    )
  }

  return (
    <div className="events-page page-content">
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImages.home})` }} />
      <div className="left-title-section with-margin">
        <span className="bold-title">Evenimente</span>
      </div>
      {loading ? <div className="spinner-border" role="status" /> : renderEventContainer()}
    </div>
  )
}

export default Events
