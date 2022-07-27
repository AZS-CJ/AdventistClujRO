import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './routes/home/Home'
import Program from './routes/program/Program'
import Contact from './routes/contact/Contact'
import Articles from './routes/articles/Articles'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/login/Login'

function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/articole" element={<Articles />} />
          <Route path="/program" element={<Program />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default Router
