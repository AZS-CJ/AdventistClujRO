import React from 'react'
import { Link } from 'react-router-dom'

import './InfoSection.scss'

const InfoSection = (props) => {
  const { title, ctaText, ctaURL, children: content, sectionRef, customCSS } = props

  return (
    <div className={`info-section default-container ${customCSS}`} ref={sectionRef}>
      <div className="info-section-title">{title}</div>
      {content}
      {ctaText && (
        <div className="default-red-button">
          <Link to={ctaURL}>{ctaText}</Link>
        </div>
      )}
    </div>
  )
}

export default InfoSection
