import React, { useState, useEffect } from 'react'
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

      const underConstruction = await underConstructionAPI()
      setIsUnderConstruction(underConstruction)
      setLoading(false)

      const { NEXT_PUBLIC_GOOGLE_ANALYTICS } = process.env
      if (NEXT_PUBLIC_GOOGLE_ANALYTICS) {
        ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as string)
        ReactGA.send({ hitType: 'pageview', page: '/home' })
      }
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
            <Content />
          </GeneralProvider>
        </NavigationProvider>
      )}
    </>
  )
}

export default App
