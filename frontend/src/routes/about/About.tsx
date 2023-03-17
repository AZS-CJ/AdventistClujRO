import React, { useEffect, useRef, useState } from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { getHistory } from '../../api/history'

import './About.scss'

export type HistoryEntry = {
  id: number
  period: string
  description: string
}

interface AboutState {
  histories: HistoryEntry[]
  loading: boolean
}

function About() {
  const { backgroundImages } = useGeneralContext()
  const [historyRequest, setHistoryRequest] = useState<AboutState>({ histories: [], loading: true })
  const [selectedPeriod, setSelectedPeriod] = useState<HistoryEntry | null>(null)
  const isMobile = window.innerWidth < 850
  const periodList = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    getHistory().then((histories: HistoryEntry[]) => {
      setHistoryRequest({ histories, loading: false })
      if (histories.length) setSelectedPeriod(histories[histories.length - 1])
      // scroll to the end of the periodList
      if (periodList.current) periodList.current.scrollLeft = periodList.current.scrollWidth
    })
  }, [])

  useEffect(() => {
    if (!selectedPeriod || !isMobile) return
    const element = document.getElementById(selectedPeriod.id.toString())
    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [selectedPeriod])

  const renderContent = () => {
    if (historyRequest.loading || !selectedPeriod) return <div className="spinner-border" role="status" />
    return (
      <div className="history">
        <div className="period-list" ref={periodList}>
          {historyRequest.histories.map((historyE) => {
            return (
              <div
                id={historyE.id.toString()}
                key={historyE.id}
                className={`period ${selectedPeriod.id === historyE.id ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(historyE)}
              >
                {historyE.period}
              </div>
            )
          })}
        </div>
        <div className="description">{selectedPeriod.description}</div>
      </div>
    )
  }
  const backgroundFilterClass = () => {
    switch (selectedPeriod?.id) {
      case 1:
        return 'black-white'
      case 2:
        return 'sepia60'
      case 3:
        return 'sepia30'
      default:
        return ''
    }
  }

  return (
    <div className="about-page page-content">
      <div className={`background-image ${backgroundFilterClass()}`} style={{ backgroundImage: `url(${backgroundImages.home}` }} />
      <div className="left-title-section with-margin">
        <span className="bold-title">Despre noi</span>
      </div>
      {renderContent()}
    </div>
  )
}

export default About
