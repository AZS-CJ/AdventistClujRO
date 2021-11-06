import React from 'react'
import logo from './logo.svg'
import './App.css'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'

function App(): JSX.Element | null {
  // eslint-disable-next-line no-console
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    </AppInsightsContext.Provider>
  )
}

export default App
