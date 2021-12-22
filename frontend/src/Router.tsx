import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Main from './Main'
import Home from './Home'

import './App.css'

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/main">Main</Link>
          </li>
        </ul>

        <hr />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </div>
      </BrowserRouter>
    )
  }
}

export default Router
