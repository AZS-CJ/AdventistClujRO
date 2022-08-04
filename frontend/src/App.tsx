import React, { useState, useEffect } from 'react'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import Router from './Router'
import { NavigationProvider } from './contexts/navigation'
import Footer from './components/Footer/Footer'
import Sidebar from './components/Sidebar/Sidebar'
import UnderConstruction from './pages/underConstruction/underConstruction'
import underConstructionAPI from './api/underConstruction'
import getBackgroundImages from './api/background'
import { stagingAPI } from './util/constants'

import './App.scss'

function App() {
  const [isUnderConstruction, setIsUnderConstruction] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [backgroundImage, setBackgroundImage] = useState<string>('')

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    (async () => {
      const underConstruction = await underConstructionAPI()
      setIsUnderConstruction(underConstruction)
      if (!underConstruction) {
        const backgroundImages = await getBackgroundImages()
        setBackgroundImage(window.innerWidth <= 850 ? backgroundImages.homeMobile : backgroundImages.homeDesktop)
      }
      setLoading(false)
    })()
  }, [])

  return loading ? (
    <div className="spinner-border all-page-loader" role="status" />
  ) : (
    <>
      {isUnderConstruction ? (
        <UnderConstruction />
      ) : (
        <NavigationProvider>
          <AppInsightsContext.Provider value={reactPlugin}>
            <div className="App">
              <div className="content" style={{ backgroundImage: `url(${stagingAPI}${backgroundImage})` }}>
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
