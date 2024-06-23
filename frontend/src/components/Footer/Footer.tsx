import React from 'react'
import { LINKS } from '../../util/constants'
import { useGeneralContext } from '../../contexts/generalState'
import './Footer.scss'

function Footer() {
  const { churchInfo } = useGeneralContext()
  return (
    <footer className={`page-footer font-small blue`}>
      <div className="container-fluid my-menu">
        <div className="row">
          <div className="col-md-8">
            <div className="social-media">
              <p>Social Media:</p>
              <div className="media-links">
                {churchInfo.youtubeLink && (
                  <a className="button" href={churchInfo.youtubeLink} target="_blank">
                    <i className="bi bi-youtube" />
                    <span className="icon-text">YouTube</span>
                  </a>
                )}
                {churchInfo.facebookLink && (
                  <a className="button" href={churchInfo.facebookLink} target="_blank">
                    <i className="bi bi-facebook" />
                    <span className="icon-text">Facebook</span>
                  </a>
                )}
                {churchInfo.instagramLink && (
                  <a className="button" href={churchInfo.instagramLink} target="_blank">
                    <div className="instagram-icon-container">
                      <h3>
                        <i className="bi bi-instagram" />
                      </h3>
                    </div>
                    <span className="icon-text">Instagram</span>
                  </a>
                )}
              </div>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} {churchInfo.churchName} &nbsp;
              <a className="address-link" href={churchInfo.locationMapLink} target="_blank">
                {churchInfo.address}
              </a>
            </div>
          </div>
          <div className="col-md-4 links">
            <div className="row">
              <div className="col-md-5">
                <a href={LINKS.ADVENTIST} className="line" target="_blank">
                  Adventist.ro
                </a>
                <div className="line longer">
                  <a href={LINKS.SEMNELE} target="_blank">
                    Semnele Timpului
                  </a>
                  <a href={LINKS.RESPIRO} target="_blank">
                    Revista Respiro
                  </a>
                </div>
                {/*<a href={LINKS.COOKIES} className="last-one" target="_blank">*/}
                {/*  Politica privind cookies*/}
                {/*</a>*/}
              </div>
              <div className="col-md-7">
                <ul className="list-unstyled">
                  <div className="line longer">
                    <a href={LINKS.SPERANTA} target="_blank">
                      Speranța TV
                    </a>
                    <a href={LINKS.RADIO} target="_blank">
                      Radio Vocea Speranței
                    </a>
                  </div>
                  <a href={LINKS.ADRA} className="line" target="_blank">
                    ADRA
                  </a>
                  {/*<a href={LINKS.CONFIDENTIAL} className="last-one" target="_blank">*/}
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
