import React, { useEffect, useState } from 'react'
import { EMAIL_TEST_REGEX, INPUT_MAX_LENGTH, InputType, PHONE_TEST_REGEX, TEXTAREA_MAX_LENGTH } from '../../util/constants'
import PropTypes from 'prop-types'

import './Input.scss'

const Input = ({ name, value, type, mandatory, onValueChange, showError }) => {
  const [showMissingErrorState, setShowMissingErrorState] = useState<boolean>(showError)
  const [validationErrorState, setValidationErrorState] = useState<boolean>(true)
  const [currentValue, setCurrentValue] = useState<string>(value)

  const label = mandatory ? `${name}*` : name

  useEffect(() => {
    setShowMissingErrorState(showError)
  }, [showError])

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const renderInput = () => {
    if (type === InputType.LONG_TEXT)
      return (
        <div className="textarea-container">
          <textarea value={currentValue} className="textarea" placeholder={name} onBlur={onBlur} onChange={onChange} maxLength={TEXTAREA_MAX_LENGTH} />
        </div>
      )
    return <input value={currentValue} type="text" className="input" placeholder={name} onBlur={onBlur} onChange={onChange} maxLength={INPUT_MAX_LENGTH} />
  }

  const validate = (value) => {
    if (!value) return !mandatory
    if (type === InputType.EMAIL) return EMAIL_TEST_REGEX.test(value)
    if (type === InputType.PHONE_NUMBER) return PHONE_TEST_REGEX.test(value)
    return value.trim().length !== 0
  }

  const onBlur = () => {
    if (mandatory && (!currentValue || currentValue.trim().length === 0)) {
      setShowMissingErrorState(true)
      if (onValueChange) onValueChange('')
    } else {
      setValidationErrorState(validate(currentValue))
      onValueChange(currentValue)
    }
  }

  const onChange = (event) => {
    setCurrentValue(event.target.value)
    if (currentValue && currentValue.trim().length !== 0) setShowMissingErrorState(false)
  }

  return (
    <div className="my-input form-group">
      <label>{label}</label>
      {renderInput()}
      {showMissingErrorState && !currentValue ? <span className="help-block">Acest câmp este necesar</span> : ''}
      {!validationErrorState && type === InputType.EMAIL ? <span className="help-block">E-Mail incorect</span> : ''}
      {!validationErrorState && type === InputType.PHONE_NUMBER ? <span className="help-block">Numărul de telefon nu este valid</span> : ''}
    </div>
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  type: PropTypes.number,
  mandatory: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
  showError: PropTypes.bool
}

Input.defaultProps = {
  value: '',
  type: InputType.TEXT,
  mandatory: false,
  showError: false
}

export default Input
