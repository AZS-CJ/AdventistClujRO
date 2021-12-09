import './App.css'
import { reactPlugin } from './ApplicationInsights'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFound/NotFound'

function App(): JSX.Element | null {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="404Page" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AppInsightsContext.Provider>
  )
}

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is my Home Page</p>
    </div>
  )
}

export default App
