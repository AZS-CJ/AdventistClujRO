import React, { useState } from 'react'
import { EMAIL_TEST_RE, InputType, PHONE_TEST_RE } from '../../util/constants'

import './Input.scss'

const Input = (props) => {
  const { name, type, mandatory, onValueChange } = props
  const [showMissingErrorState, setShowMissingErrorState] = useState<boolean>(false)
  const [validationErrorState, setValidationErrorState] = useState<boolean>(true)
  const [currentValue, setCurrentValue] = useState<string>('')

  const placeHolder = mandatory ? `${name}*` : name

  const renderInput = () => {
    console.log('render currentValue ', currentValue)
    if (type === InputType.LONG_TEXT) return <textarea value={currentValue} className="textarea" placeholder={placeHolder} onBlur={onBlur} onChange={onChange}></textarea>
    return <input value={currentValue} type="text" className="input" placeholder={placeHolder} onBlur={onBlur} onChange={onChange}></input>
  }

  const validate = (value) => {
    if (!value) return !mandatory
    if (type === InputType.EMAIL) return EMAIL_TEST_RE.test(value)
    if (type === InputType.PHONE_NUMBER) return PHONE_TEST_RE.test(value)
    return value.trim().length !== 0
  }

  const onBlur = () => {
    console.log('onBlur')
    if (mandatory && (!currentValue || currentValue.trim().length === 0)) {
      setShowMissingErrorState(true)
      if (onValueChange) onValueChange('')
    } else {
      console.log('state current ', currentValue)
      const isValid = validate(currentValue)
      setValidationErrorState(isValid)
      console.log('isvalid ', validate(currentValue))
      if (onValueChange) onValueChange(isValid ? currentValue : '')
    }
  }

  const onChange = (event) => {
    setCurrentValue(event.target.value)
    console.log('onChange ', event.target.value)
    console.log('currentValue ', currentValue)
    // validare apoi setam - daca nu e valid setam empty
    if (currentValue && currentValue.trim().length !== 0) setShowMissingErrorState(false)
  }

  return (
    <div className="my-input form-group">
      {renderInput()}
      {showMissingErrorState && !currentValue ? <span className="help-block">Acest câmp este necesar</span> : ''}
      {!validationErrorState && type === InputType.EMAIL ? <span className="help-block">E-Mail incorect</span> : ''}
      {!validationErrorState && type === InputType.PHONE_NUMBER ? <span className="help-block">Numarul de telefon nu este valid</span> : ''}
    </div>
  )
}

export default Input
