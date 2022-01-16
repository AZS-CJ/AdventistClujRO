import React from 'react'
import './App.css'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import Cookies from 'js-cookie'
import UnderConstruction from './pages/underConstruction/underConstruction'

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
    return <UnderConstruction />
  }
}

export default App
