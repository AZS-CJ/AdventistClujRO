import React from 'react'
import { LINKS } from '../../util/constants'

import './Footer.scss'
function Footer() {
  return (
    <footer className={`page-footer font-small blue`}>
      <div className="container-fluid my-menu">
        <div className="row">
          <div className="col-md-8">
            <div className="social-media">
              <p>Social Media:</p>
              <div className="media-links">
                <a className="button" href={LINKS.youtube} target="_blank">
                  <i className="bi bi-youtube" />
                  <span className="icon-text">YouTube</span>
                </a>
                <a className="button" href={LINKS.facebook} target="_blank">
                  <i className="bi bi-facebook" />
                  <span className="icon-text">Facebook</span>
                </a>
                <a className="button" href={LINKS.instagram} target="_blank">
                  <div className="instagram-icon-container">
                    <h3>
                      <i className="bi bi-instagram" />
                    </h3>
                  </div>
                  <span className="icon-text">Instagram</span>
                </a>
              </div>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} Biserica Adventistă de Ziua a Șaptea "Speranța" Cluj-Napoca &nbsp;
              <a className="address-link" href="https://goo.gl/maps/G9tndGkL8TA7hpsV8" target="_blank">
                Strada Moților 47 Cluj-Napoca | România
              </a>
            </div>
          </div>
          <div className="col-md-4 links">
            <div className="row">
              <div className="col-md-5">
                <a href={LINKS.adventist} className="line" target="_blank">
                  Adventist.ro
                </a>
                <div className="line longer">
                  <a href={LINKS.semnele} target="_blank">
                    Semnele Timpului
                  </a>
                  <a href={LINKS.respiro} target="_blank">
                    Revista Respiro
                  </a>
                </div>
                {/*<a href={LINKS.cookies} className="last-one" target="_blank">*/}
                {/*  Politica privind cookies*/}
                {/*</a>*/}
              </div>
              <div className="col-md-7">
                <ul className="list-unstyled">
                  <div className="line longer">
                    <a href={LINKS.speranta} target="_blank">
                      Speranța TV
                    </a>
                    <a href={LINKS.radio} target="_blank">
                      Radio Vocea Speranței
                    </a>
                  </div>
                  <a href={LINKS.adra} className="line" target="_blank">
                    ADRA
                  </a>
                  {/*<a href={LINKS.confidential} className="last-one" target="_blank">*/}
                  {/*  Politica de confidențialitate*/}
                  {/*</a>*/}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="emptyDiv" />
    </footer>
  )
}

export default Footer
