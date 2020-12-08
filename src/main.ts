import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import VueTimeago from 'vue-timeago'
import Buefy from 'buefy'
import VueCompositionAPI, { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'

import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { provider as apolloProvider, client as apolloClient } from './vue-apollo'

Sentry.init({
  Vue,
  dsn: window.APP_CONFIG.sentryDsn,
  integrations: [
    new Integrations.BrowserTracing()
  ],
  tracesSampleRate: 1.0,
  tracingOptions: {
    trackComponents: true
  }
})

Vue.use(Buefy)
Vue.use(VueTimeago, {
  name: 'Timeago',
  locale: 'en'
})
Vue.use(VueCompositionAPI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  setup (): void {
    provide(DefaultApolloClient, apolloClient)
  },
  render: h => h(App)
}).$mount('#app')
