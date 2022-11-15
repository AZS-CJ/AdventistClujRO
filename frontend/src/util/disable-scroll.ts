export const blockScroll = () => {
  const html = document.documentElement
  const { body } = document

  html.style.overflow = 'hidden'
  body.style.overflow = 'hidden'
}

export const allowScroll = () => {
  const html = document.documentElement
  const { body } = document

  html.style.overflow = ''
  body.style.overflow = ''
}
