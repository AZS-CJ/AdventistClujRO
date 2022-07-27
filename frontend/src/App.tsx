import React, { useState, useEffect } from 'react'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import Router from './Router'
import { NavigationProvider } from './contexts/navigation'
import Footer from './components/Footer/Footer'
import Sidebar from './components/Sidebar/Sidebar'
import UnderConstruction from './pages/underConstruction/underConstruction'
import underConstructionAPI from './api/underConstruction'

import './App.scss'

function App() {
  const [isUnderConstruction, setIsUnderConstruction] = useState<boolean>(false)

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    (async () => {
      const underConstruction = await underConstructionAPI()
      setIsUnderConstruction(underConstruction)
    })()
  }, [])

  return (
    <>
      {isUnderConstruction ? (
        <UnderConstruction />
      ) : (
        <NavigationProvider>
          <AppInsightsContext.Provider value={reactPlugin}>
            <div className="App">
              <div className="content">
                <Router />
                <Footer />
              </div>
              <Sidebar />
            </div>
          </AppInsightsContext.Provider>
        </NavigationProvider>
      )}
    </>
  )
}

export default App
