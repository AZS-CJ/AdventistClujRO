import React from 'react'

import './BackButton.scss'

const BackButton = (props: { text: string; onAction: () => void; bottom?: boolean }) => {
  const { text, onAction, bottom } = props

  return (
    <div className={`back-btn ${bottom ? 'bottom' : 'top'}`} onClick={onAction}>
      <i className="bi bi-chevron-left" />
      <span>{text}</span>
    </div>
  )
}

export default BackButton
