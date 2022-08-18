import React, { useEffect, useState } from 'react'
import InfoSection from '../../components/InfoSection/InfoSection'
import { Link } from 'react-router-dom'
import { useNavigationContext } from '../../contexts/navigation'
import getHomePageContent from '../../api/homePage'
import getProgram from '../../api/program'
import { ProgramType } from '../../data/program'
import OneDayProgram from '../../components/OneDayProgram/OneDayProgram'
import { getDayName } from '../../util/functions'

import './Home.scss'

interface ContentState {
  title: string
  description: string
  aboutUs: string
  loading: boolean
}

function Home(props) {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false)
  const { setActiveRoute } = useNavigationContext()
  const [content, setContent] = useState<ContentState>({ title: '', description: '', aboutUs: '', loading: true })
  const [program, setProgram] = useState<ProgramType[]>([])

  useEffect(() => {
    ;(async () => {
      setProgram(await getProgram())
      const response = await getHomePageContent()
      setContent({ ...response, loading: false })
    })()
  }, [])

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
    while (nextDays.length < 2 && program.length) {
      const hasProgram = program.some((p) => p.day === getDayName(dayNumber))
      if (hasProgram) nextDays.push(dayNumber)
      dayNumber = dayNumber < 7 ? dayNumber + 1 : 1
    }
    return nextDays
  }

  return content.loading ? (
    <div className="spinner-border" role="status" />
  ) : (
    <div className="home-page">
      <div className="fullScreen-wrapper">
        <div className="left-title-section">
          <span className="bold-title">{content.title}</span>
          <div className="parag">{content.description}</div>
          <div className="default-red-button">
            <Link to="/program" onClick={() => setActiveRoute('program')}>
              AFLĂ PROGRAMUL
            </Link>
          </div>
        </div>
        <div className="scroll-arrow" onClick={scrollDownBtn}>
          <i className="bi bi-chevron-down"></i>
        </div>
      </div>
      <InfoSection title="Despre noi" ctaText="Află istoricul bisericii" ctaURL="/despre">
        <div className={`description ${historyOpen ? 'open' : 'closed'}`}>
          <div className="design-lines">
            <div className="shorter" />
            <div className="longer" />
          </div>
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
          {getNext2Days().map((dayN) => (
            <OneDayProgram dayNumber={dayN} programs={program} key={dayN} />
          ))}
        </div>
      </InfoSection>
    </div>
  )
}

export default Home
