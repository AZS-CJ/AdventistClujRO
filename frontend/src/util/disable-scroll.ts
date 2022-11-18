export const blockScroll = () => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

export const allowScroll = () => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}
