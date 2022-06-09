import React from 'react'
import './styles.scss'
import text from './text.svg'
import logo from '../../../public/logo.svg'
import { Gradient } from './gradient'
import 'bootstrap/dist/css/bootstrap.min.css'

class UnderConstruction extends React.Component {
  componentDidMount() {
    const gradient = new Gradient()
    gradient['initGradient'](this.refs.gradientCanvas)
    // gradient.initGradient('#gradient-canvas')
  }
  render() {
    return (
      <div>
        <canvas id="gradient-canvas" data-transition-in ref="gradientCanvas" className="gradient-canvas"></canvas>
        <img className="church-name-logo" src={text} alt="Logo" />
        <a className="sabbath-column" href="#">
          <img className="symbol" src={logo} alt="Symbol" />
        </a>
        <main>
          <div className="title">
            <h1>
              Pagina web <br /> este în construcție
            </h1>
          </div>
          <div className="info">
            <div className="text-info">
              <a className="address" href="https://goo.gl/maps/G9tndGkL8TA7hpsV8" target="_blank">
                <i className="bi bi-geo-alt"></i> Strada Calea Moților, Nr. 47
              </a>
            </div>
            <div className="text-info">
              <a className="telephone" href="#">
                <i className="bi bi-telephone"></i> +40 7xx xxx xxx
              </a>
            </div>
            <div className="wrapper">
              <a className="button" href="https://www.youtube.com/c/AdventistCluj" target="_blank">
                <div className="icon">
                  <i className="bi bi-youtube"></i>
                </div>
                <span>YouTube</span>
              </a>
              <a className="button" href="https://www.facebook.com/BisericaSperantaCluj" target="_blank">
                <div className="icon">
                  <i className="bi bi-facebook"></i>
                </div>
                <span>Facebook</span>
              </a>
              <a className="button" href="#" target="_blank">
                <div className="icon">
                  <i className="bi bi-envelope"></i>
                </div>
                <span>Email</span>
              </a>
            </div>
          </div>
        </main>
        <footer>
          <div className="copyright">
            <a className="copyright" href="https://goo.gl/maps/G9tndGkL8TA7hpsV8" target="_blank">
              &copy 2021 Biserica Adventistă de Ziua a Șaptea "Speranța" Cluj-Napoca | România
            </a>
          </div>
        </footer>
      </div>
    )
  }
}

export default UnderConstruction
