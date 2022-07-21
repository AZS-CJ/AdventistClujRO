import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigationContext } from '../../contexts/navigation'
import menuButton from '../../assets/menuButton.svg'
import NavbarCollapse from './NavbarCollapse'

import './Navbar.scss'

function Navbar() {
  const [activeRoute, setActiveRoute] = useState(window.location.pathname)
  const [scrolled, setScrolled] = useState(false)
  const { toggleSidebar, hideSidebar } = useNavigationContext()

  const isActiveRoute = (route: string) => {
    return activeRoute.includes(route)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 0)
    window.removeEventListener('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      <nav className={`navbar my-nav my-menu ${scrolled ? 'scrolled' : ''}`}>
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

        <div className="navbar-toggler" onClick={toggleSidebar}>
          <img className="menu-btn" src={menuButton} alt="Menu" />
        </div>
      </nav>
      <NavbarCollapse renderMainLinks={renderMainLinks} />
    </>
  )
}

export default Navbar
