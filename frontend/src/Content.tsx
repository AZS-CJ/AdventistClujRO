import React, { useEffect, useState } from 'react'
import { useGeneralContext } from './contexts/generalState'
import getBackgroundImages from './api/background'
import Footer from './components/Footer/Footer'
import Router from './Router'
import Sidebar from './components/Sidebar/Sidebar'

function Content() {
  const { setBackgroundImages } = useGeneralContext()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getBackgroundImages().then((bgImages) => {
      setBackgroundImages(bgImages)
      setLoading(false)
    })
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
