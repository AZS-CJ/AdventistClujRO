import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigationContext } from '../../contexts/navigation'
import churchName from '../../assets/church_name_logo.svg'
import NavbarCollapse from './NavbarCollapse'
import { getLiveStatus } from '../../api/homePage'

import './Navbar.scss'

interface LiveState {
  isLive: boolean
  url: string
}

function Navbar(props) {
  const [scrolled, setScrolled] = useState(false)
  const { openSidebar, hideSidebar, sidebarOpen } = useNavigationContext()
  const location = useLocation()
  const [liveState, setLiveState] = useState<LiveState>({ isLive: false, url: '' })

  useEffect(() => {
    const onScroll = () => setScrolled(window.pageYOffset > 0)
    window.removeEventListener('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })

    requestLiveStatus()
    const liveRequestInterval = setInterval(() => {
      requestLiveStatus()
    }, 30000)

    return () => {
      clearInterval(liveRequestInterval)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const requestLiveStatus = () => {
    getLiveStatus().then((result) => setLiveState(result))
  }

  const isActiveRoute = (route: string) => {
    const path: string = location.pathname.replace('/', '')
    if (path === '' && route === 'acasa') return true
    return path.startsWith(route)
  }

  const renderLink = (to: string, text: string) => {
    return (
      <li className="nav-item">
        <Link className={`nav-link ${isActiveRoute(to) ? 'active' : ''}`} to={`/${to}`} onClick={hideSidebar}>
          {text}
        </Link>
      </li>
    )
  }

  const renderMainLinks = () => {
    return (
      <div className="link-list">
        {renderLink('acasa', 'Acasă')}
        {renderLink('despre', 'Despre noi')}
        {renderLink('evenimente', 'Evenimente')}
        {renderLink('program', 'Program')}
        {renderLink('contact', 'Contact')}
      </div>
    )
  }

  const openLive = () => {
    window.open(liveState.url, '_blank')
  }

  return (
    <>
      <nav className={`navbar my-nav my-menu ${scrolled ? 'scrolled' : ''}`} ref={props.navbarRef}>
        <div className="navbar-brand">
          <Link className="brand-name" to="/">
            <img className="church-name" src={churchName} alt="Church Name" />
          </Link>
        </div>
        <div className="navbar-nav desktop-nav">{renderMainLinks()}</div>

        <div className={`live-btn ${liveState.isLive ? 'live' : ''}`} onClick={openLive}>
          <i className="bi bi-play-circle"></i>
          LIVE
        </div>

        <div className="navbar-toggler" onClick={openSidebar}>
          <div className="menu-btn"></div>
        </div>
      </nav>
      <div className={`blur-content ${sidebarOpen && 'blurred'}`} />
      <NavbarCollapse renderMainLinks={renderMainLinks} />
    </>
  )
}

export default Navbar
