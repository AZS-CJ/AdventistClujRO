import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigationContext } from '../../contexts/navigation'
import menuButton from '../../assets/mobile_menu_toggle.svg'
import churchName from '../../assets/church_name_logo.svg'
import NavbarCollapse from './NavbarCollapse'

import './Navbar.scss'

function Navbar(props) {
  const [scrolled, setScrolled] = useState(false)
  const { toggleSidebar, hideSidebar, activeRoute, setActiveRoute, sidebarOpen } = useNavigationContext()

  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 0)
    window.removeEventListener('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        {renderLink('acasa', 'Acasă')}
        {/*Will be implemented later*/}
        {/*{renderLink('despre', 'Despre noi')}*/}
        {/*{renderLink('proiecte', 'Proiecte')}*/}
        {/*{renderLink('articole', 'Articole')}*/}
        {renderLink('program', 'Program')}
        {renderLink('contact', 'Contact')}
      </div>
    )
  }

  return (
    <>
      <nav className={`navbar my-nav my-menu ${scrolled ? 'scrolled' : ''}`} ref={props.navbarRef}>
        <div className="navbar-brand">
          <Link className="brand-name" to="/" onClick={() => setActiveRoute('acasa')}>
            <img className="church-name" src={churchName} alt="Church Name" />
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
      <div className={`blur-content ${sidebarOpen && 'blurred'}`}></div>
      <NavbarCollapse renderMainLinks={renderMainLinks} />
    </>
  )
}

export default Navbar
