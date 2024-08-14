import React, { useEffect, useState } from 'react'
import { useGeneralContext } from './contexts/generalState'
import getBackgroundImages from './api/background'
import getChurchInfo from './api/churchInfo'
import Footer from './components/Footer/Footer'
import Router from './Router'
import Sidebar from './components/Sidebar/Sidebar'
import getStyle from './api/style'
import { setCSSVariables } from './util/functions'

function Content() {
  const { setBackgroundImages, setChurchInfo } = useGeneralContext()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    Promise.all([getBackgroundImages(), getStyle(), getChurchInfo()])
      .then(([bgImages, style, churchInfo]) => {
        setBackgroundImages(bgImages)
        setCSSVariables(style)
        setChurchInfo(churchInfo)

        document.title = churchInfo.tabTitle
        const link = document.getElementById('favicon') as HTMLLinkElement
        if (link) link.href = churchInfo.faviconUrl
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) metaDescription.setAttribute('content', churchInfo.appDescription)
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
