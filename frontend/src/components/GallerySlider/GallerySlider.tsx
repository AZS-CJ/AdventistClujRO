import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import './GallerySlider.scss'

const GallerySlider = ({ toggleGallery, images }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(images.length - 1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const sliderWrapper = document.querySelector('.slider-wrapper')
    if (!sliderWrapper) return
    const images = Array.from(sliderWrapper.querySelectorAll('img'))
    let loadedImagesCount = 0

    const handleImageLoad = () => {
      loadedImagesCount = loadedImagesCount + 1
      if (loadedImagesCount === images.length - 1) setIsLoading(false)
    }

    images.forEach((image) => {
      image.addEventListener('load', handleImageLoad)
      image.addEventListener('error', handleImageLoad)
    })

    return () => {
      images.forEach((image) => {
        image.removeEventListener('load', handleImageLoad)
        image.removeEventListener('error', handleImageLoad)
      })
    }
  }, [])

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
      {isLoading ? <div className="spinner-border" role="status" /> : ''}
      <div className="slider-content">
        <div className="close-btn" onClick={toggleGallery}>
          &times;
        </div>
        <div className="arrow prev" onClick={handlePrevious}>
          &lt;
        </div>
        <div className="slider-wrapper" style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}>
          {images.map((img, index) => (
            <div className="img-container" key={index}>
              <img className="gallery-img" src={img.large || img.small} alt="img" />
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
