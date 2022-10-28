import React from 'react'
import PropTypes from 'prop-types'

import './Toast.scss'

const Toast = ({ show, text, onClose }) => {
  return (
    <div className={`toast position-fixed center ${show ? 'show' : ''}`} role="alert">
      <div className="d-flex">
        <div className="toast-body">{text}</div>
        <button type="button" className="btn-close me-2 m-auto btn-close-white" onClick={onClose} />
      </div>
    </div>
  )
}

Toast.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

Toast.defaultProps = {
  show: true
}

export default Toast
