import React from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { host } from '../../util/constants'

import './About.scss'

function About() {
  const { backgroundImages } = useGeneralContext()

  return (
    <div className="about-page page-content" style={{ backgroundImage: `url(${host}${backgroundImages.home}` }}>
      Despre nooooi
    </div>
  )
}

export default About
