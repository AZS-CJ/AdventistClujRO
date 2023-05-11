import React, { useState } from 'react'
import PropTypes from 'prop-types'

import './GallerySlider.scss'

const GallerySlider = ({ toggleGallery, images }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(images.length - 1)

  const handlePrevious = () => {
    if (currentImgIndex === 0) {
      setCurrentImgIndex(images.length - 1)
    } else {
      setCurrentImgIndex(currentImgIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentImgIndex === images.length - 1) {
      setCurrentImgIndex(0)
    } else {
      setCurrentImgIndex(currentImgIndex + 1)
    }
  }

  return (
    <div className="gallery-slider">
      <div className="slider-content">
        <div className="close-btn" onClick={toggleGallery}>
          &times;
        </div>
        <div className="arrow prev" onClick={handlePrevious}>
          &lt;
        </div>
        <div className="slider-wrapper" style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}>
          {images.map((img) => (
            <div className="img-container">
              <img key={img.id} className="gallery-img" src={img.large || img.small} alt="img" />
            </div>
          ))}
        </div>
        <div className="arrow next" onClick={handleNext}>
          &gt;
        </div>
      </div>
    </div>
  )
}

GallerySlider.propTypes = {
  images: PropTypes.array,
  toggleGallery: PropTypes.func.isRequired
}

export default GallerySlider
