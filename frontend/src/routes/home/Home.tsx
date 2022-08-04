import React, { useState } from 'react'
import InfoSection from '../../components/InfoSection/InfoSection'
import { Link } from 'react-router-dom'
import { useNavigationContext } from '../../contexts/navigation'

import './Home.scss'

function Home(props) {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false)
  const { setActiveRoute } = useNavigationContext()

  const scrollDownBtn = () => {
    const headerElement = window.getComputedStyle(props.navbarRef.current)
    const headerHeight = headerElement.height.split('px')[0]
    const scrollHeight = window.innerHeight - parseInt(headerHeight, 10) - window.scrollY
    const htmlElement = document.documentElement
    htmlElement.style.scrollBehavior = 'smooth'
    window.scrollBy(0, scrollHeight)
  }

  const text =
    '„Speranța” înainte de a fi o biserică, a fost o stare de spirit: oameni care au trăit experiența punerii deoparte, cu fluxuri și refluxuri, cu interogații, cu neliniști și speranțe, cu rugăciune. Prin strigăt, prin curaj, prin implicare, prin frumusețea gândurilor, prin armoniile interumane ale începutului de drum, prin credință profundă și sacrificiu, prin toate acestea la un loc, viața acestor oameni a luat încet- încet, dar tot mai amprentant chipul sidefiu al „Speranței”. Și asta pentru toți înainte-mergătorii acestei comunități, prin felul lor de a crede, de a (se) încuraja, de a spera, de a se apropia unul de celălalt, adică prin felul lor de fi, au sculptat trăinicia credinței în sufletul acestei biserici. Până la urmă, aceasta a fost experiența dulce-amară a unei mari iubiri – „Speranța”! ' +
    ' /n ' +
    'Toți suntem trecători în slujbe și în viață. Dar până la momentul încheierii alergării avem responsabilitatea de a lupta pentru această Biserică – așa cum este ea – dar mai ales pentru noblețea și frumusețea ei. Iar dacă noblețea ei rezidă în mandatul pe care Dumnezeu i l-a încredințat, frumusețea ei se naște din darurile primite de la Dumnezeu, proiectate în responsabilitățile noastre. <br/> Ca așteptători și slujitori ai lui Isus Hristos suntem datori să apărăm nu doar valorile „Speranței”, ci și climatul în care aceasta trăiește. În funcție de modul în care eu responsabilizez această chemare, comunitatea mea – și prin extrapolare- cetatea mea, pot fi un lan de grâu sau o grădină de cactuși. De aceea spune Domnul prin profetul Isaia (62:10,11): Croiți drum, dați pietrele la o parte! Ridicați un steag! Iată, Mântuitorul vine! Plata este cu El și răsplătirile merg înaintea Lui! Atunci când sufletul vă este obosit, atunci când inima tânjește după o clipă de răgaz, atunci când vă simțiți singuri sau descurajați, nu uitați că acolo sus este Cineva de care vă puteți apropia. Este Isus Hristos – sau Iubirea necondiționată. Trăiți prin El și în El, cu ”Speranța” unei inegalabile Revederi! Căci El este același ieri și azi și în veci!'

  return (
    <div className="home-page">
      <div className="fullScreen-wrapper">
        <div className="left-title-section">
          <span className="bold-title">
            Trăiește frumos <br /> și curat
          </span>
          <div className="parag">Alege să participi la programele puse la dispoziție de Biserica Adventistă de Ziua a Șaptea “Speranța” din Cluj-Napoca.</div>
          <div className="default-red-button">
            <Link to="/program" onClick={() => setActiveRoute('program')}>
              AFLĂ PROGRAMUL
            </Link>
          </div>
        </div>
        <div className="scroll-arrow" onClick={scrollDownBtn}>
          <i className="bi bi-chevron-down"></i>
        </div>
      </div>
      <InfoSection title="Despre noi" ctaText="Află istoricul bisericii" ctaURL="/despre">
        <div className={`description ${historyOpen ? 'open' : 'closed'}`}>
          <div className="design-lines">
            <div className="shorter" />
            <div className="longer" />
          </div>
          <div className="text">{text}</div>
          <div className="moreButton" onClick={() => setHistoryOpen(true)}>
            Citește mai mult
          </div>
          <div className="lessButton" onClick={() => setHistoryOpen(false)}>
            Citește mai puțin
          </div>
        </div>
      </InfoSection>
      <InfoSection title="Program" ctaText={'Vezi întregul program'} ctaURL="/program">
        <div>content Program</div>
      </InfoSection>
    </div>
  )
}

export default Home
