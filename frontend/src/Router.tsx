import React, { useRef } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './routes/home/Home'
import Program from './routes/program/Program'
import Contact from './routes/contact/Contact'
import Articles from './routes/articles/Articles'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/login/Login'
import About from './routes/about/About'
import { useNavigationContext } from './contexts/navigation'

function Router() {
  const { sidebarOpen } = useNavigationContext()
  const navbarRef = useRef()

  return (
    <BrowserRouter>
      <Navbar navbarRef={navbarRef} />
      <div className={`router-content ${sidebarOpen && 'blurred'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/despre" element={<About />} />
          <Route path="/articole" element={<Articles />} />
          <Route path="/program" element={<Program />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/*" element={<Home navbarRef={navbarRef} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default Router
