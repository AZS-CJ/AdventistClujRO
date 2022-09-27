import React from 'react'
import { useGeneralContext } from '../../contexts/generalState'

function Contact() {
  const { backgroundImages } = useGeneralContext()

  return (
    <div className="page-content" style={{ backgroundImage: `url(${backgroundImages.contact || backgroundImages.home}` }}>
      Contact
    </div>
  )
}

export default Contact
