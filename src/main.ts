import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { provider as apolloProvider } from './vue-apollo'
import Buefy from 'buefy'
import VueTimeago from 'vue-timeago'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.use(VueTimeago, {
  name: 'Timeago',
  locale: 'en'
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
