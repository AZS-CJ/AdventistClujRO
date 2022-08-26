import React from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { stagingAPI } from '../../util/constants'

import './About.scss'

function About() {
  const { backgroundImages } = useGeneralContext()

  return (
    <div className="about-page page-content" style={{ backgroundImage: `url(${stagingAPI}${backgroundImages.home}` }}>
      Despre nooooi
    </div>
  )
}

export default About
