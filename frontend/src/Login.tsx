import React from 'react'
import './App.css'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import Cookies from 'js-cookie'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

interface IState {
  username?: string
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { username: Cookies.get('displayName') }
    this.renderContent = this.renderContent.bind(this)
  }

  render() {
    return (
      <AppInsightsContext.Provider value={reactPlugin}>
        <div className="App">{this.renderContent()}</div>
      </AppInsightsContext.Provider>
    )
  }

  renderContent() {
    if (!!this.state.username)
      return (
        <div className="login">
          <span>HI {this.state.username}!</span>
          <a href="/auth/logout" role="button">
            Logout
          </a>
        </div>
      )
    return (
      <div className="login">
        <a href="/auth/facebook" role="button">
          Login with facebook
        </a>
        <a href="/auth/google" role="button">
          Login with GOOGLE
        </a>
      </div>
    )
  }
}

export default App
