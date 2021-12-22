import React from 'react'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import Router from './Router'
import Login from './Login'

import './App.css'

class App extends React.Component {
  render() {
    return (
      <AppInsightsContext.Provider value={reactPlugin}>
        <div className="App">
          <Login />
          <Router />
        </div>
      </AppInsightsContext.Provider>
    )
  }
}

export default App
