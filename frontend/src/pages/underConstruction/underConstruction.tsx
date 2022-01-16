import React from 'react'
import styles from './styles.scss'

class UnderConstruction extends React.Component {
  render() {
    return (
      <div>
        <canvas id="gradient-canvas" data-transition-in></canvas>
        <img className={styles.church-name-logo} src="20211019_biserica_adventista_speranta_L Secondary.svg" alt="Logo" />
        <a className="sabbath-column" href="#">
          <img class="symbol" src="20211019_biserica_adventista_logo.svg" alt="Symbol" />
        </a>
        <main>
          <div class="title">
            <h1>
              Pagina web <br /> este în construcție
            </h1>
          </div>
          <div class="info">
            <div class="text-info">
              <a class="address" href="https://goo.gl/maps/G9tndGkL8TA7hpsV8" target="_blank">
                <i class="bi bi-geo-alt"></i> Strada Calea Moților, Nr. 47
              </a>
            </div>
            <div class="text-info">
              <a class="telephone" href="#">
                <i class="bi bi-telephone"></i> +40 7xx xxx xxx
              </a>
            </div>
            <div class="wrapper">
              <a class="button" href="https://www.youtube.com/c/AdventistCluj" target="_blank">
                <div class="icon">
                  <i class="bi bi-youtube"></i>
                </div>
                <span>YouTube</span>
              </a>
              <a class="button" href="https://www.facebook.com/BisericaSperantaCluj" target="_blank">
                <div class="icon">
                  <i class="bi bi-facebook"></i>
                </div>
                <span>Facebook</span>
              </a>
              <a class="button" href="#" target="_blank">
                <div class="icon">
                  <i class="bi bi-envelope"></i>
                </div>
                <span>Email</span>
              </a>
            </div>
          </div>
        </main>
        <footer>
          <div class="copyright">
            <a class="copyright" href="https://goo.gl/maps/G9tndGkL8TA7hpsV8" target="_blank">
              {' '}
              &copy 2021 Biserica Adventistă de Ziua a Șaptea "Speranța" Cluj-Napoca | România
            </a>
          </div>
        </footer>
      </div>
    )
  }
}

export default UnderConstruction
