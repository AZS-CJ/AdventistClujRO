import React from 'react'
import { Link } from 'react-router-dom'
import menuButton from './assets/menuButton.svg'
import { LINKS } from './util/constants'
import logo from './assets/logo.svg'

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
    this.renderMainLinks = this.renderMainLinks.bind(this)
    this.handleCollapse = this.handleCollapse.bind(this)
  }

  handleCollapse() {
    const nav = document.getElementById('navbarCollapse')
    const btn = document.getElementById('navbarBtn')
    if (nav) nav.classList.remove('show')
    if (btn) btn.classList.add('collapsed')
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
            <div className="brand-title">Biserica Adventistă de Ziua a Șaptea</div>
            <div className="red-box">SPERANȚA CLUJ-NAPOCA</div>
          </Link>
        </div>
        <div className="navbar-nav desktop-nav">{this.renderMainLinks()}</div>

        {/*render this only if there is a live streaming*/}
        <div className="main-live live">LIVE</div>

        <div className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <img className="menu-btn" src={menuButton} alt="Menu" />
        </div>

        <div className="collapse navbar-collapse bg-dark" id="navbarCollapse">
          <div className="navbar-content">
            <div className="close-nav" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" id="navbarBtn">
              <p>X</p>
            </div>
            <ul className="navbar-nav mr-auto">
              {/*render this only if there is a live streaming*/}
              <div className="sidebar-live live">LIVE</div>
              {this.renderMainLinks()}
              {this.renderLink('login', 'Log in')}
              <img className="church-logo" src={logo} alt="Logo" />
              <p>Biserica Adventistă de Ziua a Șaptea "Speranța" din Cluj-Napoca</p>
              <p className="sidebar-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan magna enim, at facilisis turpis ullamcorper sed. In viverra eu ipsum sit amet dignissim.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. m dolor sit amet, consectetur adipiscing elit. Cras accumsan magna enim, at facilisis turpis ullamcorper
                sed. In viverra eu ipsum sit amet dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit.!!!!
              </p>
            </ul>

            <div className="navbar-resources">
              <div className="navbar-resources-title"> Resurse: </div>
              <div className="resources-list">
                <a href={LINKS.adventist} target="_blank">
                  Adventist.ro
                </a>
                <a href={LINKS.semnele} className="longer" target="_blank">
                  Semnele Timpului
                </a>
                <a href={LINKS.respiro} target="_blank">
                  Revista Respiro
                </a>
                <a href={LINKS.speranta} className="longer" target="_blank">
                  Speranța TV
                </a>
                <a href={LINKS.radio} target="_blank">
                  Radio Vocea Speranței
                </a>
                <a href={LINKS.adra} target="_blank">
                  ADRA
                </a>
              </div>
              <div className="social-media">
                <div className="navbar-resources-title"> Social Media: </div>
                <div className="resources-list">
                  <a className="button" href={LINKS.youtube} target="_blank">
                    YouTube
                  </a>
                  <a className="button" href={LINKS.facebook} target="_blank">
                    Facebook
                  </a>
                  <a className="button" href={LINKS.instagram} target="_blank">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  renderMainLinks() {
    return (
      <div className="link-list">
        {this.renderLink('home', 'Acasă')}
        {this.renderLink('despre', 'Despre noi')}
        {this.renderLink('proiecte', 'Proiecte')}
        {this.renderLink('evenimente', 'Evenimente')}
        {this.renderLink('articole', 'Articole')}
        {this.renderLink('program', 'Program')}
        {this.renderLink('contact', 'Contact')}
      </div>
    )
  }

  renderLink(to: string, text: string) {
    return (
      <li className="nav-item" onClick={this.handleCollapse}>
        <Link className={`nav-link ${this.isActiveRoute(to) ? 'active' : ''}`} to={`/${to}`} onClick={() => this.setActiveRoute(to)}>
          {text}
        </Link>
      </li>
    )
  }
}

export default Navbar
