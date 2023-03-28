import React, { useEffect, useState } from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { EventType } from '../../data/event'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getEvent } from '../../api/event'
import { getFormattedPeriod } from '../../util/functions'
import BackButton from '../../components/BackButton/BackButton'

import './EventPage.scss'

interface EventState {
  event: EventType | null
  loading: boolean
}
interface CustomState {
  from: string
}

function EventPage() {
  const [eventRequest, setEventRequest] = useState<EventState>({ event: null, loading: true })
  const { backgroundImages } = useGeneralContext()
  const { idAndTitle } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state ? (location.state as CustomState).from : ''
  const backBtnText = from === 'home' ? 'Acasă' : 'Evenimente'

  useEffect(() => {
    if (!idAndTitle) return
    const id = idAndTitle.split('-')[0]
    getEvent(id).then((event) => {
      if (!event) navigate(`/evenimente`)
      else setEventRequest({ event: event, loading: false })
    })
  }, [])

  const goBack = () => {
    from ? navigate(-1) : navigate('/evenimente')
  }

  const { loading, event } = eventRequest

  if (loading || !event) return <div className="spinner-border" role="status" />

  const renderFacebookLink = () => {
    return (
      <div className="fb-link">
        <i className="bi bi-facebook" />
        <a href={event.facebookLink} target="_blank">
          Vezi pagina de facebook a evenimentului
        </a>
      </div>
    )
  }
  return (
    <div className="event-page page-content">
      <div className="background-image" style={{ backgroundImage: `url(${event.largeImg ? event.largeImg : backgroundImages.home})` }} />
      <BackButton text={backBtnText} onAction={goBack} />
      <div className="left-title-section">
        <span className="bold-title"> {event.title} </span>
        <div className="event-date-type">
          <span>{getFormattedPeriod(event.startDate, event.endDate)}</span>
          <span>{event.type}</span>
        </div>
      </div>
      <div className="event-content">
        <div className="content-intro">{event.intro}</div>
        <div className="content-text">
          {event.content} {event.facebookLink ? renderFacebookLink() : ''}
        </div>
        <BackButton text={backBtnText} onAction={goBack} bottom={true} />
      </div>
    </div>
  )
}

export default EventPage
