import React, { useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { EventType } from '../../data/event'
import getEvents from '../../api/event'
import { host } from '../../util/constants'
import { getFormattedPeriod } from '../../util/functions'

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
  const isMobile = window.innerWidth < 850

  useEffect(() => {
    ;(async () => {
      const events: EventType[] = await getEvents()
      const lastEl = events.pop()
      if (lastEl) events.unshift(lastEl)
      setEventsData({ events, loading: false })
      setInitialActiveId(!isMobile && events.length > 1 ? events[1].id : null)
    })()
  }, [])

  const renderEventCard = (item) => {
    return (
      <div className={`event-card ${initialActiveId === item.id ? 'active-element' : ''}`} key={item.id} style={{ backgroundImage: `url(${host}${item.smallImg}` }}>
        <div className="event-card-body">
          <h5 className="event-card-period">{getFormattedPeriod(item.startDate, item.endDate)}</h5>
          <h5 className="event-card-title">{item.title}</h5>
        </div>
      </div>
    )
  }

  const afterSlideChange = () => {
    if (initialActiveId) setInitialActiveId(null)
    const elements = document.getElementsByClassName('react-multi-carousel-item--active')
    if (elements.length === 3) {
      elements[0].children[0].classList.remove('active-element')
      elements[1].children[0].classList.add('active-element')
      elements[2].children[0].classList.remove('active-element')
    }
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 850 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 849, min: 0 },
      items: 1,
      slidesToSlide: 1
    }
  }

  const renderCarousel = () => (
    <Carousel
      centerMode={isMobile}
      additionalTransfrom={10}
      swipeable={true}
      draggable={false}
      showDots={true}
      responsive={responsive}
      ssr={true}
      infinite={true}
      autoPlay={false}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      customTransition="transform 200ms ease-in-out"
      transitionDuration={200}
      containerClass={`carousel-container ${eventsData.events.length < 3 ? 'center' : ''}`}
      deviceType={isMobile ? 'mobile' : 'desktop'}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
      customButtonGroup={<ButtonGroup next={null} previous={null} />}
      renderButtonGroupOutside={true}
      arrows={false}
      customDot={<CustomDot onClick={undefined} active={undefined} />}
      afterChange={afterSlideChange}
    >
      {eventsData.events.map((item) => renderEventCard(item))}
    </Carousel>
  )

  return eventsData.loading ? <div className="spinner-border" role="status" /> : renderCarousel()
}

export default EventsCarousel
