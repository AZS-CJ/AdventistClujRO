import React from 'react'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import logo from './assets/logo.svg'
import Router from './Router'
import Footer from './Footer'
// import Login from './Login'
import UnderConstruction from './pages/underConstruction/underConstruction'
import underConstructionAPI from './api/underConstruction'

import './App.scss'

interface IState {
  isUnderConstruction: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class App extends React.Component<any, IState> {
  constructor(props) {
    super(props)
    this.state = { isUnderConstruction: false }
  }

  async componentDidMount() {
    const isUnderConstruction = await underConstructionAPI()
    this.setState({ isUnderConstruction })
  }

  render() {
    if (this.state.isUnderConstruction) {
      return <UnderConstruction />
    }
    return (
      <AppInsightsContext.Provider value={reactPlugin}>
        <div className="App">
          {/*<Login />*/}
          {/*<UnderConstruction />*/}
          <div className="content">
            <Router />
            <Footer />
          </div>
          <div className="logo-column">
            <img className="church-logo" src={logo} alt="Logo" />
          </div>
        </div>
      </AppInsightsContext.Provider>
    )
  }
}

export default App
