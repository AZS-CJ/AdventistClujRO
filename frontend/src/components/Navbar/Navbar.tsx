import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigationContext } from '../../contexts/navigation'

import menuButton from '../../assets/menuButton.svg'
import { LINKS } from '../../util/constants'
import logo from '../../assets/logo.svg'

import './Navbar.scss'

function Navbar() {
  const [activeRoute, setActiveRoute] = useState(window.location.pathname)
  const { sidebarOpen, toggleSidebar, hideSidebar } = useNavigationContext()

  const isActiveRoute = (route: string) => {
    return activeRoute.includes(route)
  }

  const renderLink = (to: string, text: string) => {
    return (
      <li className="nav-item" onClick={hideSidebar}>
        <Link className={`nav-link ${isActiveRoute(to) ? 'active' : ''}`} to={`/${to}`} onClick={() => setActiveRoute(to)}>
          {text}
        </Link>
      </li>
    )
  }

  const renderMainLinks = () => {
    return (
      <div className="link-list">
        {renderLink('home', 'Acasă')}
        {/*Will be implemented later*/}
        {/*{renderLink('despre', 'Despre noi')}*/}
        {/*{renderLink('proiecte', 'Proiecte')}*/}
        {/*{renderLink('evenimente', 'Evenimente')}*/}
        {/*{renderLink('articole', 'Articole')}*/}
        {renderLink('program', 'Program')}
        {renderLink('contact', 'Contact')}
      </div>
    )
  }

  return (
    <>
      <nav className="navbar my-nav my-menu">
        <div className="navbar-brand">
          <Link className="brand-name" to="/">
            <div className="brand-title">Biserica Adventistă de Ziua a Șaptea</div>
            <div className="red-box">SPERANȚA CLUJ-NAPOCA</div>
          </Link>
        </div>
        <div className="navbar-nav desktop-nav">{renderMainLinks()}</div>

        {/*Will be implemented later*/}
        {/*render this only if there is a live streaming*/}
        {/*<div className="main-live live">LIVE</div>*/}

        <div className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <img className="menu-btn" src={menuButton} alt="Menu" />
        </div>

        <div className={`navbar-collapse bg-dark ${sidebarOpen ? 'show' : ''}`} id="navbarCollapse">
          <div className="navbar-content">
            <div className="close-nav" id="navbarBtn" onClick={toggleSidebar}>
              <p>X</p>
            </div>
            <ul className="navbar-nav mr-auto">
              {/*Will be implemented later*/}
              {/*render this only if there is a live streaming*/}
              {/*<div className="sidebar-live live">LIVE</div>*/}
              {renderMainLinks()}
              {/*Will be implemented later*/}
              {/*{renderLink('login', 'Log in')}*/}
              <div>
                <img className="nav-church-logo" src={logo} alt="Logo" />
                <p>Biserica Adventistă de Ziua a Șaptea "Speranța" din Cluj-Napoca</p>
                <p className="sidebar-description">TO EDIT - O descriere mai mica despre Biserica</p>
              </div>
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
    </>
  )
}

export default Navbar
