import React, { useEffect, useState } from 'react'
import { useGeneralContext } from '../../contexts/generalState'
import { InputType } from '../../util/constants'
import { ContactType } from '../../data/contact'
import getContact from '../../api/contact'
import Divider from '../../components/Divider/Divider'
import Input from '../../components/Input/Input'

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

function Contact() {
  const [contactRequest, setContactRequest] = useState<ContactState>({ contact: {}, loading: true })
  const { backgroundImages } = useGeneralContext()
  const message: Message = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    text: ''
  }

  useEffect(() => {
    ;(async () => {
      getContact().then((contact: ContactType) => setContactRequest({ contact, loading: false }))
    })()
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
          <p className="value">{contactRequest.contact.phone}</p>
        </div>
        <div className="line">
          <p className="section">E-Mail:</p>
          <p className="value">{contactRequest.contact.email}</p>
        </div>
        <div className="line">
          <p className="section">Adresă:</p>
          <p className="value">Strada Moților 47 Cluj-Napoca | România</p>
        </div>
      </div>
    )
  }

  const sendEmail = () => {
    console.log('sendEmail')
  }

  const allFilled = () => {
    return message.lastName && message.firstName && message.email && message.text
  }

  const renderForm = () => {
    return (
      <div className="contact-form">
        <div className="form-line">
          <Input name="Nume" type={InputType.TEXT} mandatory={true} onValueChange={(val) => (message.lastName = val)} />
          <Input name="Prenume" type={InputType.TEXT} mandatory={true} onValueChange={(val) => (message.firstName = val)} />
        </div>
        <div className="form-line">
          <Input name="E-Mail" type={InputType.EMAIL} mandatory={true} onValueChange={(val) => (message.email = val)} />
          <Input name="Telefon" type={InputType.PHONE_NUMBER} mandatory={false} onValueChange={(val) => (message.phone = val)} />
        </div>
        <Input name="Mesajul tău" type={InputType.LONG_TEXT} mandatory={true} onValueChange={(val) => (message.text = val)} />
        <div className={`default-red-button ${allFilled() ? '' : 'disabled'}`} onClick={sendEmail}>
          Trimite
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (contactRequest.loading) return <div className="spinner-border" role="status" />
    return (
      <div className="default-container">
        {renderContactDetails()}
        <Divider />
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2732.9267602304976!2d23.578147215477273!3d46.76634007913797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490e838cb267e1%3A0x5c5ba645a780a9a8!2sCalea%20Mo%C8%9Bilor%2047%2C%20Cluj-Napoca%20400000!5e0!3m2!1sen!2sro!4v1658478337807!5m2!1sen!2sro"
          width="1136"
          height="432"
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <Divider />
        {renderForm()}
      </div>
    )
  }

  return (
    <div className="contact-page page-content" style={{ backgroundImage: `url(${backgroundImages.contact || backgroundImages.home}` }}>
      <div className="left-title-section with-margin">
        <span className="bold-title">Contact</span>
      </div>
      {renderContent()}
    </div>
  )
}

export default Contact
