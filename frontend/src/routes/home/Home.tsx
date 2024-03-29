import React, { useEffect, useState } from 'react'
import InfoSection from '../../components/InfoSection/InfoSection'
import { Link } from 'react-router-dom'
import { getHomePageContent } from '../../api/homePage'
import getProgram from '../../api/program'
import { ProgramType } from '../../data/program'
import OneDayProgram from '../../components/OneDayProgram/OneDayProgram'
import { getDayName } from '../../util/functions'
import { useGeneralContext } from '../../contexts/generalState'
import EventsCarousel from './EventsCarousel'
import DesignLines from '../../components/DesignLines/DesignLines'

import './Home.scss'

interface ContentState {
  title: string
  description: string
  aboutUs: string
  loading: boolean
}

function Home(props) {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false)
  const [content, setContent] = useState<ContentState>({ title: '', description: '', aboutUs: '', loading: true })
  const [program, setProgram] = useState<ProgramType[]>([])
  const { backgroundImages } = useGeneralContext()

  useEffect(() => {
    getProgram().then((program) => setProgram(program))
    getHomePageContent().then((response) => setContent({ ...response, loading: false }))
    afterOrientationChange()
    return () => {
      window.removeEventListener('resize', afterOrientationChange)
      window.removeEventListener('orientationchange', orientationChangeCallback)
    }
  }, [])

  //compute the necessary height for the div to be fullscreen, first time, and on orientation change for mobile
  const afterOrientationChange = function () {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    window.removeEventListener('resize', afterOrientationChange)
  }
  const orientationChangeCallback = function () {
    window.addEventListener('resize', afterOrientationChange)
  }

  window.addEventListener('orientationchange', orientationChangeCallback)

  const scrollDownBtn = () => {
    const headerElement = window.getComputedStyle(props.navbarRef.current)
    const headerHeight = headerElement.height.split('px')[0]
    const scrollHeight = window.innerHeight - parseInt(headerHeight, 10) - window.scrollY
    const htmlElement = document.documentElement
    htmlElement.style.scrollBehavior = 'smooth'
    window.scrollBy(0, scrollHeight)
  }

  // returns list of 2 DateNumber of the next 2 days that have at least 1 program
  const getNext2Days = () => {
    const nextDays: number[] = []
    let dayNumber = new Date().getDay() + 1
    // if today is saturday, consider that today is friday
    if (dayNumber === 7) dayNumber = 6
    while (nextDays.length < 2 && program.length) {
      const hasProgram = program.some((p) => p.day === getDayName(dayNumber))
      if (hasProgram) nextDays.push(dayNumber)
      dayNumber = dayNumber < 7 ? dayNumber + 1 : 1
    }
    return nextDays
  }

  const returnContent = () => {
    return (
      <>
        <div className="fullscreen-wrapper">
          <div className="left-title-section">
            <span className="bold-title">{content.title}</span>
            <div className="parag">{content.description}</div>
            <div className="default-red-button">
              <Link to="/program">AFLĂ PROGRAMUL</Link>
            </div>
          </div>
          <div className="scroll-arrow" onClick={scrollDownBtn}>
            <i className="bi bi-chevron-down"></i>
          </div>
        </div>
        <InfoSection title="Despre noi" ctaText="Află istoricul bisericii" ctaURL="/despre">
          <div className={`description ${historyOpen ? 'open' : 'closed'}`}>
            <DesignLines />
            <div className="text">{content.aboutUs}</div>
            <div className="moreButton" onClick={() => setHistoryOpen(true)}>
              Citește mai mult
            </div>
            <div className="lessButton" onClick={() => setHistoryOpen(false)}>
              Citește mai puțin
            </div>
          </div>
        </InfoSection>
        <InfoSection title="Program" ctaText={'Vezi întregul program'} ctaURL="/program">
          <div className="program-section">
            <div className="next">urmează:</div>
            {getNext2Days().map((dayN, index) => (
              <OneDayProgram dayNumber={dayN} programs={program} key={index} />
            ))}
          </div>
        </InfoSection>
        <InfoSection title="Evenimente" customCSS="event-container">
          <EventsCarousel />
        </InfoSection>
      </>
    )
  }

  return (
    <div className="home-page page-content">
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImages.home})` }} />
      {content.loading ? <div className="spinner-border" role="status" /> : returnContent()}
    </div>
  )
}

export default Home
