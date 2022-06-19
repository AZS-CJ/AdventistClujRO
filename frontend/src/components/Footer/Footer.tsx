import React from 'react'
import { LINKS } from '../../util/constants'

import './Footer.scss'

class Footer extends React.Component {
  render() {
    return (
      <footer className="page-footer font-small blue my-menu">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="social-media">
                <a className="button" href={LINKS.youtube} target="_blank">
                  <i className="bi bi-youtube" />
                  <span>YouTube</span>
                </a>
                <a className="button" href={LINKS.facebook} target="_blank">
                  <i className="bi bi-facebook" />
                  <span>Facebook</span>
                </a>
                <a className="button" href={LINKS.instagram} target="_blank">
                  <i className="bi bi-instagram" />
                  <span>Instagram</span>
                </a>
              </div>
              <div className="footer-copyright">
                © {new Date().getFullYear()} Biserica Adventistă de Ziua a Șaptea "Speranța" Cluj-Napoca
                <a className="address-link" href="https://goo.gl/maps/G9tndGkL8TA7hpsV8" target="_blank">
                  Strada Moților 47 Cluj-Napoca | România
                </a>
              </div>
            </div>
            <div className="col-md-4 links">
              <div className="row">
                <div className="col-md-5">
                  <a href={LINKS.adventist} target="_blank">
                    Adventist.ro
                  </a>
                  <a href={LINKS.semnele} className="longer" target="_blank">
                    Semnele Timpului
                  </a>
                  <a href={LINKS.respiro} target="_blank">
                    Revista Respiro
                  </a>
                </div>
                <div className="col-md-5">
                  <ul className="list-unstyled">
                    <a href={LINKS.speranta} className="longer" target="_blank">
                      Speranța TV
                    </a>
                    <a href={LINKS.radio} target="_blank">
                      Radio Vocea Speranței
                    </a>
                    <a href={LINKS.adra} target="_blank">
                      ADRA
                    </a>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
