import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Despre from './routes/Despre'
import Home from './routes/Home'
import Articles from './routes/articles/Articles'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/login/Login'

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Navbar />

        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/despre" element={<Despre />} />
            <Route path="/articole" element={<Articles />} />
            <Route path="/*" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    )
  }
}

export default Router
