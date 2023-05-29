import React, { useEffect, useRef, useState } from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { getHistory } from '../../api/history'
import { getGallery } from '../../api/gallery'
import InfoSection from '../../components/InfoSection/InfoSection'
import { HistoryEntry, ImageType } from '../../data/about'
import DesignLines from '../../components/DesignLines/DesignLines'
import GallerySlider from '../../components/GallerySlider/GallerySlider'

import './About.scss'

interface AboutState {
  histories: HistoryEntry[]
  loading: boolean
}

interface GalleryState {
  images: ImageType[]
  description: string
  loading: boolean
}

function About() {
  const { backgroundImages } = useGeneralContext()
  const [historyRequest, setHistoryRequest] = useState<AboutState>({ histories: [], loading: true })
  const [selectedPeriod, setSelectedPeriod] = useState<HistoryEntry | null>(null)

  const [galleryRequest, setGalleryRequest] = useState<GalleryState>({ description: '', images: [], loading: true })
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false)

  const isMobile = window.innerWidth < 850
  const periodList = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    getHistory().then((histories: HistoryEntry[]) => {
      setHistoryRequest({ histories, loading: false })
      if (histories.length) setSelectedPeriod(histories[0])
    })
    getGallery().then((gallery) => {
      setGalleryRequest({ description: gallery.description, images: gallery.images, loading: false })
    })
  }, [])

  useEffect(() => {
    //scroll to the selected period if it's mobile
    if (!selectedPeriod || !isMobile) return
    const element = document.getElementById(selectedPeriod.id.toString())
    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [selectedPeriod])

  const renderHistory = () => {
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
    // period with id 1 is the oldest; and the higher the id, the more recent the event
    switch (selectedPeriod?.id) {
      case 1:
        return 'sec19'
      case 2:
        return 'sec20'
      case 3:
        return 'sec20-1'
      case 4:
        return 'sec20-2'
      default:
        return ''
    }
  }

  const toggleGallery = () => {
    setGalleryOpen(!galleryOpen)
  }

  const renderGallery = () => {
    if (galleryRequest.loading) return <div className="spinner-border" role="status" />
    if (galleryRequest.images.length === 0) return ''
    return (
      <InfoSection title="Galerie">
        <div className="gallery-section">
          <div className="img-container">
            <img onClick={toggleGallery} src={galleryRequest.images[0].small} alt="image" />
          </div>
          <div className="description">
            <DesignLines />
            {galleryRequest.description}
          </div>
        </div>
      </InfoSection>
    )
  }

  return (
    <div className={`about-page page-content ${galleryOpen ? 'gallery-open' : ''}`}>
      <div className={`background-image ${backgroundFilterClass()}`} style={{ backgroundImage: `url(${backgroundImages.home}` }} />
      <div className="left-title-section with-margin">
        <span className="bold-title">Despre noi</span>
      </div>
      {renderHistory()}
      {renderGallery()}
      {galleryOpen ? <GallerySlider toggleGallery={toggleGallery} images={galleryRequest.images} /> : ''}
    </div>
  )
}

export default About
