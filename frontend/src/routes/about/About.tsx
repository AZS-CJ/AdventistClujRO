import React from 'react'
import { useGeneralContext } from '../../contexts/generalState'

import './About.scss'

function About() {
  const { backgroundImages } = useGeneralContext()

  return (
    <div className="about-page page-content" style={{ backgroundImage: `url(${backgroundImages.home}` }}>
      Despre nooooi
    </div>
  )
}

export default About
