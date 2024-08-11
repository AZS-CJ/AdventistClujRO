import { createContext, useContext, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const GeneralContext = createContext([{}, () => {}])

const GeneralProvider = ({ children }) => {
  const [generalState, setGeneralState] = useState({
    backgroundImages: { home: '' },
    churchInfo: { tabTitle: 'Biserica', churchName: '', nameLogoURL: '', address: '' }
  })
  return <GeneralContext.Provider value={[generalState, setGeneralState]}>{children}</GeneralContext.Provider>
}

const useGeneralContext = () => {
  const [genState, setGenState] = useContext(GeneralContext)

  const setBackgroundImages = (imgs) => {
    setGenState((prevState) => ({
      ...prevState,
      backgroundImages: imgs
    }))
  }

  const setChurchInfo = (churchInfo) => {
    setGenState((prevState) => ({
      ...prevState,
      churchInfo
    }))
  }

  return {
    setBackgroundImages,
    backgroundImages: genState.backgroundImages,
    setChurchInfo,
    churchInfo: genState.churchInfo
  }
}

export { GeneralContext, GeneralProvider, useGeneralContext }
