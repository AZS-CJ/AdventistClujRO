import React from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { stagingAPI } from '../../util/constants'

function Contact() {
  const { backgroundImages } = useGeneralContext()

  return (
    <div className="page-content" style={{ backgroundImage: `url(${stagingAPI}${backgroundImages.contact || backgroundImages.home}` }}>
      Contact
    </div>
  )
}

export default Contact
