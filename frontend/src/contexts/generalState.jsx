import { createContext, useContext, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const GeneralContext = createContext([{}, () => {}])

const GeneralProvider = ({ children }) => {
  const [generalState, setGeneralState] = useState({
    backgroundImages: { home: '' }
  })
  return <GeneralContext.Provider value={[generalState, setGeneralState]}>{children}</GeneralContext.Provider>
}

const useGeneralContext = () => {
  const [genState, setGenState] = useContext(GeneralContext)

  const setBackgroundImages = (imgs) => {
    setGenState(() => ({ backgroundImages: imgs }))
  }

  return {
    setBackgroundImages,
    backgroundImages: genState.backgroundImages
  }
}

export { GeneralContext, GeneralProvider, useGeneralContext }
