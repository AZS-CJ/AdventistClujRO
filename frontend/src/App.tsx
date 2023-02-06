import React, { useState, useEffect } from 'react'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { NavigationProvider } from './contexts/navigation'
import UnderConstruction from './pages/underConstruction/underConstruction'
import underConstructionAPI from './api/underConstruction'
import { GeneralProvider } from './contexts/generalState'
import Content from './Content'
import ReactGA from 'react-ga'

import './App.scss'

function App() {
  const [isUnderConstruction, setIsUnderConstruction] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    (async () => {

      ReactGA.initialize('G-R730Q5P12D')
      ReactGA.pageview(window.location.pathname)

      const underConstruction = await underConstructionAPI()
      setIsUnderConstruction(underConstruction)
      setLoading(false)
    })()
  }, [])

  return loading ? (
    <div className="spinner-border" role="status" />
  ) : (
    <>
      {isUnderConstruction ? (
        <UnderConstruction />
      ) : (
        <NavigationProvider>
          <GeneralProvider>
            <AppInsightsContext.Provider value={reactPlugin}>
              <Content />
            </AppInsightsContext.Provider>
          </GeneralProvider>
        </NavigationProvider>
      )}
    </>
  )
}

export default App
