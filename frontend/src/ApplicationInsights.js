import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ReactPlugin } from '@microsoft/applicationinsights-react-js'
import { createBrowserHistory } from 'history'

const browserHistory = createBrowserHistory({ basename: '' })
const reactPlugin = new ReactPlugin()
const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: '6db1cb37-ebf4-4646-a325-00c7f35edd7c',
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory }
    }
  }
})
appInsights.loadAppInsights()
export { reactPlugin, appInsights }
