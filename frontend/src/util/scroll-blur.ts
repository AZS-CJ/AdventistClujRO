export const handleImageBlur = () => {
  const windowScroll = window.pageYOffset
  const blurAmount = windowScroll / 150
  const scaleAmount = windowScroll / 50000 + 1
  document.documentElement.style.setProperty(`--${'scaleAmount'}`, `${scaleAmount}`)
  if (blurAmount < 12) document.documentElement.style.setProperty(`--${'blurAmount'}`, `${blurAmount}px`)
  else document.documentElement.style.setProperty(`--${'blurAmount'}`, '12px')
}
