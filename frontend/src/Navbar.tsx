import React from 'react'
import { Link } from 'react-router-dom'
import menuButton from './assets/menuButton.svg'

import './Navbar.scss'

interface IState {
  activeRoute: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <nav className="navbar my-nav my-menu">
        <div className="navbar-brand">
          <Link className="brand-name" to="/">
            <div className="title">Biserica Adventistă de Ziua a Șaptea</div>
            <div className="red-box">SPERANȚA CLUJ-NAPOCA</div>
          </Link>
        </div>
        <div className="navbar-nav">
          {this.renderLink('home', 'Acasă')}
          {this.renderLink('despre', 'Despre noi')}
          {this.renderLink('proiecte', 'Proiecte')}
          {this.renderLink('evenimente', 'Evenimente')}
          {this.renderLink('articole', 'Articole')}
          {this.renderLink('program', 'Program')}
          {this.renderLink('contact', 'Contact')}
        </div>

        {/*render this only if there is a live streaming*/}
        <div className="live">LIVE</div>
        <div className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <img className="menu-btn" src={menuButton} alt="Menu" />
        </div>
        <div className="collapse navbar-collapse bg-dark" id="navbarCollapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li>
          </ul>
        </div>
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
