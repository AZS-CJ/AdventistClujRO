import React, { useRef, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './routes/home/Home'
import Program from './routes/program/Program'
import Contact from './routes/contact/Contact'
import Navbar from './components/Navbar/Navbar'
import { handleImageBlur } from './util/scroll-blur'
// import Login from './pages/login/Login'
// import About from './routes/about/About'

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
          {/*<Route path="/login" element={<Login />} />*/}
          {/*<Route path="/despre" element={<About />} />*/}
          <Route path="/program" element={<Program />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/*" element={<Home navbarRef={navbarRef} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default Router
