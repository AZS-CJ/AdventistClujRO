import { createContext, useContext, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NavigationContext = createContext([{}, () => {}])

const NavigationProvider = ({ children }) => {
  const [navigationState, setNavigationState] = useState({
    isOpen: false,
    activeRoute: window.location.pathname
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

  const setActiveRoute = (route) => {
    setNavState((state) => ({ ...state, activeRoute: route }))
  }

  return {
    toggleSidebar,
    hideSidebar,
    setActiveRoute,
    sidebarOpen: navState.isOpen,
    activeRoute: navState.activeRoute
  }
}

export { NavigationContext, NavigationProvider, useNavigationContext }
