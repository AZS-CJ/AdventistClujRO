import React from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { host } from '../../util/constants'

function Contact() {
  const { backgroundImages } = useGeneralContext()

  return (
    <div className="page-content" style={{ backgroundImage: `url(${host}${backgroundImages.contact || backgroundImages.home}` }}>
      Contact
    </div>
  )
}

export default Contact
