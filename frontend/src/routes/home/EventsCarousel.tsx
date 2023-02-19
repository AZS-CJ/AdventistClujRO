import React, { useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { EventType } from '../../data/event'
import { getLastEvents } from '../../api/event'
import { useNavigate } from 'react-router-dom'
import { getFormattedPeriod, reorderEvents } from '../../util/functions'
import { v4 as uuid } from 'uuid'

import './EventsCarousel.scss'

interface EventState {
  events: EventType[]
  loading: boolean
}

const ButtonGroup = ({ next, previous }) => {
  return (
    <div className="carousel-button-group">
      <div className="custom-arrow" onClick={() => previous()}>
        &lt;
      </div>
      <div className="custom-arrow" onClick={() => next()}>
        &gt;
      </div>
    </div>
  )
}

const CustomDot = ({ onClick, active }) => {
  return <div className={`custom-line ${active ? 'active' : 'inactive'}`} onClick={() => onClick()} />
}

function EventsCarousel() {
  const [eventsData, setEventsData] = useState<EventState>({ events: [], loading: true })
  const [initialActiveId, setInitialActiveId] = useState<number | null>(null)
  const isMobile = window.innerWidth < 464
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      const { events: events } = await getLastEvents()
      const newOrderEvents = reorderEvents(events, isMobile)
      setInitialActiveId(!isMobile && newOrderEvents.length > 1 ? newOrderEvents[1].id : newOrderEvents.length === 1 ? newOrderEvents[0].id : null)
      setEventsData({ events: newOrderEvents, loading: false })
    })()
  }, [])

  const goToEventPage = (id: number) => {
    navigate(`/evenimente/${id}`, { state: { from: 'home' } })
  }

  const renderEventCard = (item) => {
    const isPastEvent = new Date(item.endDate) < new Date()
    const shouldBeActive = initialActiveId === item.id
    return (
      <div
        className={`event-card ${shouldBeActive ? 'active-element' : ''} ${isPastEvent ? 'past' : ''}`}
        key={uuid()}
        style={{ backgroundImage: `url(${item.smallImg}` }}
        onClick={() => goToEventPage(item.id)}
      >
        <div className="event-card-body">
          <h5 className="event-card-period">{getFormattedPeriod(item.startDate, item.endDate)}</h5>
          <h5 className="event-card-title">{item.title}</h5>
        </div>
      </div>
    )
  }

  const afterSlideChange = () => {
    if (isMobile) return
    // this is for desktop, where there are 3 active items but only 1 should be really active
    if (initialActiveId) setInitialActiveId(null)
    // remove active class from every item
    const items = document.getElementsByClassName('react-multi-carousel-item')
    for (let i = 0; i < items.length; i++) {
      items[i].children[0].classList.remove('active-element')
    }
    //add active class to the middle one
    const activeItems = document.getElementsByClassName('react-multi-carousel-item--active')
    if (activeItems.length > 1) {
      activeItems[1].children[0].classList.add('active-element')
    }
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: eventsData.events.length === 2 ? 2 : 3,
      slidesToSlide: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: eventsData.events.length === 2 ? 2 : 3,
      slidesToSlide: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1
    }
  }

  const renderCarousel = () => (
    <Carousel
      centerMode={isMobile}
      focusOnSelect={isMobile}
      additionalTransfrom={10}
      swipeable={true}
      draggable={false}
      showDots={eventsData.events.length > 1}
      responsive={responsive}
      ssr={true}
      infinite={eventsData.events.length > 1}
      autoPlay={false}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      customTransition="transform 200ms ease-in-out"
      transitionDuration={200}
      containerClass={`carousel-container ${eventsData.events.length === 1 ? 'center' : ''}`}
      deviceType={isMobile ? 'mobile' : 'desktop'}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
      customButtonGroup={eventsData.events.length > 1 ? <ButtonGroup next={null} previous={null} /> : null}
      renderButtonGroupOutside={true}
      arrows={false}
      customDot={<CustomDot onClick={undefined} active={undefined} />}
      afterChange={afterSlideChange}
    >
      {eventsData.events.map((item) => renderEventCard(item))}
    </Carousel>
  )

  if (eventsData.loading) return <div className="spinner-border" role="status" />
  if (!eventsData.events.length) return <div className="no-events">Momentan nu sunt evenimente</div>
  return renderCarousel()
}

export default EventsCarousel
