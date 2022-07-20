import { createContext, useContext, useState } from 'react'

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

  const toggleSidebar = () => {
    setNavState((state) => ({ ...state, isOpen: !state.isOpen }))
  }

  const hideSidebar = () => {
    setNavState((state) => ({ ...state, isOpen: false }))
  }

  return {
    toggleSidebar,
    hideSidebar,
    sidebarOpen: navState.isOpen
  }
}

export { NavigationContext, NavigationProvider, useNavigationContext }
