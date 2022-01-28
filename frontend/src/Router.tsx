import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Despre from './routes/Despre'
import Home from './routes/Home'
import Articole from './routes/Articole'
import Navbar from './Navbar'

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Navbar />

        <div>
          <Routes>
            <Route path="/despre" element={<Despre />} />
            <Route path="/articole" element={<Articole />} />
            <Route path="/*" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    )
  }
}

export default Router
