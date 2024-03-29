import React, { useRef, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './routes/home/Home'
import Program from './routes/program/Program'
import Contact from './routes/contact/Contact'
import Navbar from './components/Navbar/Navbar'
import { handleImageBlur } from './util/scroll-blur'
import Events from './routes/events/Events'
import EventPage from './routes/events/EventPage'
import About from './routes/about/About'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

function Router() {
  const navbarRef = useRef()
  useEffect(() => {
    window.addEventListener('scroll', handleImageBlur)
    return () => {
      window.removeEventListener('scroll', handleImageBlur)
    }
  })

  return (
    <BrowserRouter>
      <Navbar navbarRef={navbarRef} />
      <div className="router-content">
        <Routes>
          <Route path="/despre" element={<About />} />
          <Route path="/program" element={<Program />} />
          <Route path="/evenimente" element={<Events />} />
          <Route path="/evenimente/:idAndTitle" element={<EventPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/*" element={<Home navbarRef={navbarRef} />} />
        </Routes>
        <ScrollToTop />
      </div>
    </BrowserRouter>
  )
}

export default Router
