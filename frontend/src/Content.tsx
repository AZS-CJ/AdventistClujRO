import React, { useEffect, useState } from 'react'
import { useGeneralContext } from './contexts/generalState'
import getBackgroundImages from './api/background'
import Footer from './components/Footer/Footer'
import Router from './Router'
import Sidebar from './components/Sidebar/Sidebar'
import getStyle from './api/style'
import { setCSSVariables } from './util/functions'

function Content() {
  const { setBackgroundImages } = useGeneralContext()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    Promise.all([getBackgroundImages(), getStyle()])
      .then(([bgImages, style]) => {
        setBackgroundImages(bgImages)
        setCSSVariables(style)
      })
      .finally(() => setLoading(false))
  }, [])

  return loading ? (
    <div className="spinner-border" role="status" />
  ) : (
    <div className="App">
      <div className="content">
        <Router />
        <Footer />
      </div>
      <Sidebar />
    </div>
  )
}

export default Content
