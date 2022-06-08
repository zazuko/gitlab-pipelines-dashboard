import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import VueTimeago from 'vue-timeago'
import VueCompositionAPI, { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { provider as apolloProvider, client as apolloClient } from './vue-apollo'

const app = createApp(App)

Sentry.init({
  app,
  dsn: window.APP_CONFIG.sentryDsn,
  integrations: [
    new Integrations.BrowserTracing()
  ],
  tracesSampleRate: 1.0,
  tracingOptions: {
    trackComponents: true
  }
})

app.use(VueTimeago, {
  name: 'Timeago',
  locale: 'en'
})

app.use(router)
app.use(store)
app.use(apolloProvider)
app.provide(DefaultApolloClient, apolloClient)
app.mount('#app')
