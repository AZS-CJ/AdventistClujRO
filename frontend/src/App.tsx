import React from 'react'
import logo from './logo.svg'
import './App.css'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'

class App extends React.Component {
  render() {
    return (
      <AppInsightsContext.Provider value={reactPlugin}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <a href="/auth/facebook" role="button">
              Login with facebook
            </a>
          </header>
        </div>
      </AppInsightsContext.Provider>
    )
  }
}

export default App
