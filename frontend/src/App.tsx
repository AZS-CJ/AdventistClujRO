import React, { useState, useEffect } from 'react'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { NavigationProvider } from './contexts/navigation'
import UnderConstruction from './pages/underConstruction/underConstruction'
import underConstructionAPI from './api/underConstruction'
import { GeneralProvider } from './contexts/generalState'
import Content from './Content'
import ReactGA from 'react-ga4'

import './App.scss'

function App() {
  const [isUnderConstruction, setIsUnderConstruction] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    (async () => {

      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS || '')
      ReactGA.send({ hitType: 'pageview', page: '/home' })

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
