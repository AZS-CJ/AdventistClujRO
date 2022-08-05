import React from 'react'
import { useNavigationContext } from '../../contexts/navigation'
import { Link } from 'react-router-dom'

import './InfoSection.scss'

const InfoSection = (props) => {
  const { title, ctaText, ctaURL, children: content, sectionRef } = props
  const { setActiveRoute } = useNavigationContext()

  return (
    <div className="info-section default-container" ref={sectionRef}>
      <div className="info-section-title">{title}</div>
      {content}
      {ctaText && (
        <div className="default-red-button">
          <Link to={ctaURL} onClick={() => setActiveRoute(ctaURL)}>
            {ctaText}
          </Link>
        </div>
      )}
    </div>
  )
}

export default InfoSection
