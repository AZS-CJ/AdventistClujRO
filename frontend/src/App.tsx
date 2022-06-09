import React from 'react'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import Router from './Router'
import Footer from './Footer'
import Login from './Login'
import UnderConstruction from './pages/underConstruction/underConstruction'

import './App.scss'

class App extends React.Component {
  render() {
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
            <img className="church-logo" src="logo.svg" alt="Logo" />
          </div>
        </div>
      </AppInsightsContext.Provider>
    )
  }
}

export default App
