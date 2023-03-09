import { createContext, useContext, useState } from 'react'
import { blockScroll, allowScroll } from '../util/disable-scroll'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NavigationContext = createContext([{}, () => {}])

const NavigationProvider = ({ children }) => {
  const [navigationState, setNavigationState] = useState({
    isOpen: false
  })
  return <NavigationContext.Provider value={[navigationState, setNavigationState]}>{children}</NavigationContext.Provider>
}

const useNavigationContext = () => {
  const [navState, setNavState] = useContext(NavigationContext)

  const openSidebar = () => {
    setNavState((state) => ({ ...state, isOpen: true }))
    blockScroll()
  }

  const hideSidebar = () => {
    setNavState((state) => ({ ...state, isOpen: false }))
    allowScroll()
  }

  return {
    openSidebar,
    hideSidebar,
    sidebarOpen: navState.isOpen
  }
}

export { NavigationContext, NavigationProvider, useNavigationContext }
