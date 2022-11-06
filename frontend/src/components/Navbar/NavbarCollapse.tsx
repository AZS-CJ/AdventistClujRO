import React from 'react'
import { useNavigationContext } from '../../contexts/navigation'
import { LINKS } from '../../util/constants'
import logo from '../../assets/logo.svg'

import './NavbarCollapse.scss'

function NavbarCollapse(props) {
  const { sidebarOpen, toggleSidebar } = useNavigationContext()
  return (
    <div className={`navbar-collapse bg-dark ${sidebarOpen ? 'show' : 'hide'}`} id="navbarCollapse">
      <div className="navbar-content">
        <div className="close-nav" id="navbarBtn" onClick={toggleSidebar}>
          <p>X</p>
        </div>
        <ul className="navbar-nav mr-auto">
          {/*Will be implemented later*/}
          {/*render this only if there is a live streaming*/}
          {/*<div className="sidebar-live live">LIVE</div>*/}
          {props.renderMainLinks()}
          {/*Will be implemented later*/}
          {/*{renderLink('login', 'Log in')}*/}
          <div>
            <img className="nav-church-logo" src={logo} alt="Logo" />
            <p>Biserica Adventistă de Ziua a Șaptea "Speranța" din Cluj-Napoca</p>
            {/*Will be implemented later*/}
            {/*<p className="sidebar-description">TO EDIT - O descriere mai mica despre Biserica</p>*/}
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
  )
}

export default NavbarCollapse
