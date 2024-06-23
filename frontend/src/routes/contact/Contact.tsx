import React, { useEffect, useState } from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { EMAIL_TEST_REGEX, InputType, PHONE_TEST_REGEX } from '../../util/constants'
import { ContactType } from '../../data/contact'
import Divider from '../../components/Divider/Divider'
import Input from '../../components/Input/Input'
import { getContact, sendEmail } from '../../api/contact'
import Toast from '../../components/Toast/Toast'

import './Contact.scss'

interface ContactState {
  contact: ContactType
  loading: boolean
}

interface Message {
  firstName: string
  lastName: string
  email: string
  phone: string
  text: string
}

const messageInitialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  text: ''
}

function Contact() {
  const { backgroundImages } = useGeneralContext()
  const [contactRequest, setContactRequest] = useState<ContactState>({
    contact: {
      pastor: '',
      phone: '',
      email: '',
      address: '',
      mapsIframeSrc: ''
    },
    loading: true
  })
  const [message, setMessage] = useState<Message>(messageInitialState)
  const [loading, setLoading] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [responseMessage, setResponseMessage] = useState<string>('')
  let toastTimeout

  useEffect(() => {
    getContact().then((contact: ContactType) => setContactRequest({ contact, loading: false }))
    return () => {
      clearTimeout(toastTimeout)
    }
  }, [])

  const renderContactDetails = () => {
    return (
      <div className="contact-details">
        <div className="line">
          <p className="section">Pastor:</p>
          <p className="value">{contactRequest.contact.pastor}</p>
        </div>
        <div className="line">
          <p className="section">Telefon:</p>
          <a className="value" href={`tel:${contactRequest.contact.phone}`}>
            {contactRequest.contact.phone}
          </a>
        </div>
        <div className="line">
          <p className="section">E-Mail:</p>
          <a className="value" href={`mailto:${contactRequest.contact.email}`}>
            {contactRequest.contact.email}
          </a>
        </div>
        <div className="line">
          <p className="section">Adresă:</p>
          <p className="value">
            {contactRequest.contact.address} <span className="desktop-break">|</span> România
          </p>
        </div>
      </div>
    )
  }

  const setField = (fieldName, value) => {
    setMessage({ ...message, [fieldName]: value })
  }

  const dataIsValid = () => {
    if (!message.lastName || !message.firstName || !message.email || !message.text) return false
    if (message.phone) return PHONE_TEST_REGEX.test(message.phone)
    return EMAIL_TEST_REGEX.test(message.email)
  }

  const callSendEmail = () => {
    if (dataIsValid()) {
      setLoading(true)
      sendEmail(message)
        .then(() => {
          setMessage(messageInitialState)
          setResponseMessage('Mesajul tău s-a trimis cu success!')
        })
        .catch(() => {
          setResponseMessage('A apărut o eroare, te rugăm să încerci din nou.')
        })
        .finally(() => {
          toastTimeout = setTimeout(() => setResponseMessage(''), 3000)
          setShowError(false)
          setLoading(false)
        })
    } else {
      setShowError(true)
    }
  }

  const renderForm = () => {
    return (
      <div className="contact-form">
        <div className="form-line">
          <Input name="Nume" value={message.lastName} mandatory={true} showError={showError} onValueChange={(val) => setField('lastName', val)} />
          <Input name="Prenume" value={message.firstName} mandatory={true} showError={showError} onValueChange={(val) => setField('firstName', val)} />
        </div>
        <div className="form-line">
          <Input name="E-Mail" value={message.email} type={InputType.EMAIL} mandatory={true} showError={showError} onValueChange={(val) => setField('email', val)} />
          <Input name="Telefon" value={message.phone} type={InputType.PHONE_NUMBER} mandatory={false} onValueChange={(val) => setField('phone', val)} />
        </div>
        <Input name="Mesajul tău" value={message.text} type={InputType.LONG_TEXT} mandatory={true} showError={showError} onValueChange={(val) => setField('text', val)} />
        <button className={`default-red-button ${loading ? 'disabled' : ''}`} onClick={callSendEmail}>
          Trimite
          {loading ? <div className="spinner-border" role="status" /> : ''}
        </button>
        {responseMessage ? <Toast text={responseMessage} onClose={() => setResponseMessage('')} /> : ''}
      </div>
    )
  }

  const renderContent = () => {
    if (contactRequest.loading) return <div className="spinner-border" role="status" />
    return (
      <div className="default-container">
        {renderContactDetails()}
        <Divider />
        <iframe src={contactRequest.contact.mapsIframeSrc} height="432" allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        <Divider />
        {renderForm()}
      </div>
    )
  }

  return (
    <div className="contact-page page-content">
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImages.contact || backgroundImages.home}` }} />
      <div className="left-title-section with-margin">
        <span className="bold-title">Contact</span>
      </div>
      {renderContent()}
    </div>
  )
}

export default Contact
