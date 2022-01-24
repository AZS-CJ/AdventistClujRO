import React from 'react'
import { Link } from 'react-router-dom'

import './Navbar.scss'

interface IState {
  activeRoute: string
}

class Navbar extends React.Component<any, IState> {
  constructor(props) {
    super(props)
    this.state = { activeRoute: window.location.pathname }
    this.setActiveRoute = this.setActiveRoute.bind(this)
    this.isActiveRoute = this.isActiveRoute.bind(this)
    this.renderLink = this.renderLink.bind(this)
  }

  setActiveRoute(route) {
    this.setState({ activeRoute: route })
  }

  isActiveRoute(route: string) {
    return this.state.activeRoute.includes(route)
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg my-nav">
        <div className="navbar-brand">
          <Link className="brand-name" to="/">
            <div className="title">Biserica Adventista de Ziua a Saptea</div>
            <div className="red-box">SPERANTA CLUJ-NAPOCA</div>
          </Link>
        </div>
        <div className="navbar-nav">
          {this.renderLink('home', 'Acasa')}
          {this.renderLink('despre', 'Despre noi')}
          {this.renderLink('proiecte', 'Proiecte')}
          {this.renderLink('evenimente', 'Evenimente')}
          {this.renderLink('articole', 'Articole')}
          {this.renderLink('program', 'Program')}
          {this.renderLink('contact', 'Contact')}
        </div>

        {/*render this only if there is a live streaming*/}
        <div className="live">LIVE</div>
      </nav>
    )
  }

  renderLink(to: string, text: string) {
    return (
      <li className="nav-item">
        <Link className={`nav-link ${this.isActiveRoute(to) ? 'active' : ''}`} to={`/${to}`} onClick={() => this.setActiveRoute(to)}>
          {text}
        </Link>
      </li>
    )
  }
}

export default Navbar
