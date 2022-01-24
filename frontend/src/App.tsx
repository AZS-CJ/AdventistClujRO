import React from 'react'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import Router from './Router'
import Login from './Login'
import './App.scss'

class App extends React.Component {
  render() {
    return (
      <AppInsightsContext.Provider value={reactPlugin}>
        <div className="App">
          {/*<Login />*/}
          <div className="content">
            <Router />
          </div>
          <div className="right-bar" />
        </div>
      </AppInsightsContext.Provider>
    )
  }
}

export default App
